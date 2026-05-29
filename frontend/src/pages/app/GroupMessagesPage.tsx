import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Send, Trash2 } from "lucide-react";

import { messageService } from "../../services/message.service";
import { groupService } from "../../services/group.service";

import type { GroupMessage } from "../../types/message.type";
import type { GroupDetail } from "../../types/group.type";
import { useAuth } from "../../hooks/useAuth";

export default function GroupMessagesPage() {
  const { id } = useParams();

  const groupId = Number(id);

  const { user } = useAuth();

  const [group, setGroup] = useState<GroupDetail | null>(null);
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [content, setContent] = useState("");

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const fetchData = async () => {
    try {
      const [groupData, messagesData] = await Promise.all([
        groupService.getGroupById(groupId),
        messageService.getGroupMessages(groupId),
      ]);

      setGroup(groupData);
      setMessages(messagesData);
    } catch (error: any) {
      setError(
        error.response?.data?.error ||
          "Erreur lors du chargement de la messagerie",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [groupId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const isOwner = group?.owner.id === user?.id;

  const canDeleteMessage = (message: GroupMessage) => {
    return message.userId === user?.id || isOwner;
  };

  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!content.trim()) return;

    try {
      setSending(true);
      setError("");
      setSuccess("");

      await messageService.createMessage(groupId, {
        content: content.trim(),
      });

      setContent("");
      await fetchData();
    } catch (error: any) {
      setError(
        error.response?.data?.error || "Erreur lors de l’envoi du message",
      );
    } finally {
      setSending(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      setError("");
      setSuccess("");

      await messageService.deleteMessage(messageId);

      setSuccess("Message supprimé.");
      await fetchData();
    } catch (error: any) {
      setError(
        error.response?.data?.error ||
          "Erreur lors de la suppression du message",
      );
    }
  };

  if (loading) {
    return <p>Chargement des messages...</p>;
  }

  if (!group) {
    return <p>Groupe introuvable.</p>;
  }

  return (
    <div>
      <Link
        to={`/groups/${groupId}`}
        className="mb-6 inline-block text-sm font-medium text-blue-600"
      >
        ← Retour au groupe
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Messagerie — {group.name}</h1>

        <p className="mt-2 text-slate-600">
          Échange avec les membres du groupe.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-lg bg-green-100 p-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <section className="flex h-[650px] flex-col rounded-2xl border bg-white shadow-sm">
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-semibold">Conversation</h2>

          <p className="text-sm text-slate-500">{messages.length} message(s)</p>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-center text-slate-500">
              Aucun message pour le moment.
            </div>
          ) : (
            messages.map((message) => {
              const isMine = message.userId === user?.id;

              return (
                <div
                  key={message.id}
                  className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 ${
                      isMine
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-900"
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between gap-4">
                      <p
                        className={`text-xs font-semibold ${
                          isMine ? "text-blue-100" : "text-slate-500"
                        }`}
                      >
                        {message.author
                          ? `${message.author.firstname} ${message.author.lastname}`
                          : "Utilisateur inconnu"}
                      </p>

                      {canDeleteMessage(message) && (
                        <button
                          onClick={() => handleDeleteMessage(message.id)}
                          className={`rounded p-1 ${
                            isMine
                              ? "text-blue-100 hover:bg-blue-700"
                              : "text-slate-500 hover:bg-slate-200"
                          }`}
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <p className="whitespace-pre-wrap text-sm">
                      {message.content}
                    </p>

                    <p
                      className={`mt-2 text-right text-xs ${
                        isMine ? "text-blue-100" : "text-slate-500"
                      }`}
                    >
                      {new Date(message.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })
          )}

          <div ref={bottomRef} />
        </div>

        <form onSubmit={handleSendMessage} className="border-t p-4">
          <div className="flex gap-3">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={1000}
              placeholder="Écrire un message..."
              className="min-h-14 flex-1 resize-none rounded-lg border px-4 py-3"
            />

            <button
              type="submit"
              disabled={sending || !content.trim()}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              Envoyer
            </button>
          </div>

          <p className="mt-2 text-right text-xs text-slate-500">
            {content.length}/1000
          </p>
        </form>
      </section>
    </div>
  );
}
