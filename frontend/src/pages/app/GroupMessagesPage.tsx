import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Send, Trash2, Users } from "lucide-react";

import { messageService } from "../../services/message.service";
import { groupService } from "../../services/group.service";

import type { GroupMessage } from "../../types/message.type";
import type { GroupDetail } from "../../types/group.type";
import { useAuth } from "../../hooks/useAuth";
import { getApiErrorMessage } from "../../utils/apiError";

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

  const fetchData = useCallback(async () => {
    try {
      const [groupData, messagesData] = await Promise.all([
        groupService.getGroupById(groupId),
        messageService.getGroupMessages(groupId),
      ]);

      setGroup(groupData);
      setMessages(messagesData);
    } catch (error) {
      setError(
        getApiErrorMessage(error, "Erreur lors du chargement de la messagerie"),
      );
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchData();
  }, [fetchData]);

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
    } catch (error) {
      setError(
        getApiErrorMessage(error, "Erreur lors de l’envoi du message"),
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
    } catch (error) {
      setError(
        getApiErrorMessage(error, "Erreur lors de la suppression du message"),
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

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">SkillBridge - Messagerie collaborative</h1>

        <p className="mt-2 text-slate-600">
          Échange directement avec les membres de ton groupe.
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

      <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            <h2 className="font-semibold">Membres du groupe</h2>
          </div>

          <ul className="mt-5 space-y-3 text-sm">
            {group.members.map((member) => (
              <li key={member.id} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-600" />
                <span>
                  {member.firstname} {member.lastname}
                  {member.id === user?.id ? " (moi)" : ""}
                </span>
              </li>
            ))}
          </ul>
        </aside>

        <section className="flex h-[650px] flex-col rounded-2xl border bg-white shadow-sm">
          <div className="border-b px-6 py-4 text-center">
            <h2 className="text-lg font-semibold">{group.name}</h2>

            <p className="text-sm text-slate-500">{messages.length} message(s)</p>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-6">
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center text-center text-slate-500">
                Aucun message pour le moment. Écris le premier message du groupe.
              </div>
            ) : (
              messages.map((message) => {
                const isMine = message.userId === user?.id;

                return (
                  <div
                    key={message.id}
                    className={`rounded-lg border p-4 ${
                      isMine ? "border-blue-200 bg-blue-50" : "bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-sm">
                        <strong>
                          {isMine
                            ? "Moi"
                            : message.author
                              ? `${message.author.firstname} ${message.author.lastname}`
                              : "Utilisateur inconnu"}
                          {" : "}
                        </strong>
                        <span className="whitespace-pre-wrap">{message.content}</span>
                      </p>

                      {canDeleteMessage(message) && (
                        <button
                          onClick={() => handleDeleteMessage(message.id)}
                          className="rounded p-1 text-slate-500 transition-colors duration-200 hover:bg-red-100 hover:text-red-700"
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <p className="mt-2 text-right text-xs text-slate-500">
                      {new Date(message.createdAt).toLocaleString()}
                    </p>
                  </div>
                );
              })
            )}

            <div ref={bottomRef} />
          </div>

          <form onSubmit={handleSendMessage} className="border-t p-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={1000}
                placeholder="Écrire un message..."
                className="min-h-12 flex-1 rounded-lg border px-4 py-3"
              />

              <button
                type="submit"
                disabled={sending || !content.trim()}
                className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition-colors duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                {sending ? "Envoi..." : "Envoyer"}
              </button>
            </div>

            <p className="mt-2 text-right text-xs text-slate-500">
              {content.length}/1000
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}
