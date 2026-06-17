// Importation des hooks React
// useState : gestion des états locaux
// useEffect : exécution d'effets au montage ou lors d'un changement de dépendance
// useCallback : mémorisation d'une fonction pour éviter sa recréation inutile
// useRef : création d'une référence vers un élément du DOM
import { useCallback, useEffect, useRef, useState } from "react";

// Link permet la navigation interne
// useParams permet de récupérer l'id du groupe depuis l'URL
import { Link, useParams } from "react-router-dom";

// Importation des icônes utilisées dans l'interface
import { Send, Trash2, Users } from "lucide-react";

// Services API pour les messages et les groupes
import { messageService } from "../../services/message.service";
import { groupService } from "../../services/group.service";

// Types TypeScript des messages et du groupe
import type { GroupMessage } from "../../types/message.type";
import type { GroupDetail } from "../../types/group.type";

// Hook d'authentification pour connaître l'utilisateur connecté
import { useAuth } from "../../hooks/useAuth";

// Utilitaire pour afficher une erreur API compréhensible
import { getApiErrorMessage } from "../../utils/apiError";

// Page de messagerie collaborative d'un groupe
export default function GroupMessagesPage() {
  // Récupère le paramètre dynamique :id dans l'URL
  const { id } = useParams();

  // Convertit l'id de string vers number
  const groupId = Number(id);

  // Récupère l'utilisateur connecté
  const { user } = useAuth();

  // Informations détaillées du groupe
  const [group, setGroup] = useState<GroupDetail | null>(null);

  // Liste des messages du groupe
  const [messages, setMessages] = useState<GroupMessage[]>([]);

  // Contenu du message en cours de rédaction
  const [content, setContent] = useState("");

  // État de chargement initial
  const [loading, setLoading] = useState(true);

  // État indiquant si un message est en cours d'envoi
  const [sending, setSending] = useState(false);

  // Message d'erreur affiché dans l'interface
  const [error, setError] = useState("");

  // Message de succès affiché dans l'interface
  const [success, setSuccess] = useState("");

  // Référence vers un élément invisible placé en bas de la liste
  // Elle sert à faire défiler automatiquement la messagerie vers le dernier message
  const bottomRef = useRef<HTMLDivElement | null>(null);

  /**
   * Récupère les informations du groupe et ses messages.
   *
   * Promise.all permet d'exécuter les deux appels API en parallèle :
   * - récupération du groupe
   * - récupération des messages
   */
  const fetchData = useCallback(async () => {
    try {
      const [groupData, messagesData] = await Promise.all([
        groupService.getGroupById(groupId),
        messageService.getGroupMessages(groupId),
      ]);

      // Mise à jour des données dans le state
      setGroup(groupData);
      setMessages(messagesData);
    } catch (error) {
      // Gestion d'erreur lors du chargement initial
      setError(
        getApiErrorMessage(error, "Erreur lors du chargement de la messagerie"),
      );
    } finally {
      // Fin du chargement, même si une erreur survient
      setLoading(false);
    }
  }, [groupId]);

  /**
   * Chargement initial des données.
   *
   * Le commentaire eslint désactive une règle liée au setState dans useEffect.
   * Ici, fetchData contient déjà la logique de chargement.
   */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchData();
  }, [fetchData]);

  /**
   * Défile automatiquement vers le bas
   * à chaque mise à jour de la liste des messages.
   */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // Vérifie si l'utilisateur connecté est le propriétaire du groupe
  const isOwner = group?.owner.id === user?.id;

  /**
   * Vérifie si l'utilisateur peut supprimer un message.
   *
   * Un message peut être supprimé si :
   * - il appartient à l'utilisateur connecté ;
   * - ou l'utilisateur connecté est propriétaire du groupe.
   */
  const canDeleteMessage = (message: GroupMessage) => {
    return message.userId === user?.id || isOwner;
  };

  /**
   * Envoie un nouveau message dans le groupe.
   *
   * @param event Événement de soumission du formulaire
   */
  const handleSendMessage = async (event: React.FormEvent) => {
    // Empêche le rechargement de la page
    event.preventDefault();

    // Empêche l'envoi d'un message vide ou composé uniquement d'espaces
    if (!content.trim()) return;

    try {
      // Active l'état d'envoi
      setSending(true);

      // Réinitialise les anciens messages d'erreur/succès
      setError("");
      setSuccess("");

      // Création du message côté API
      await messageService.createMessage(groupId, {
        content: content.trim(),
      });

      // Vide le champ de saisie après l'envoi
      setContent("");

      // Recharge les données pour afficher le nouveau message
      await fetchData();
    } catch (error) {
      setError(getApiErrorMessage(error, "Erreur lors de l’envoi du message"));
    } finally {
      // Désactive l'état d'envoi
      setSending(false);
    }
  };

  /**
   * Supprime un message.
   *
   * @param messageId Identifiant du message à supprimer
   */
  const handleDeleteMessage = async (messageId: string) => {
    try {
      // Réinitialise les messages d'interface
      setError("");
      setSuccess("");

      // Appel API de suppression
      await messageService.deleteMessage(messageId);

      // Message de confirmation
      setSuccess("Message supprimé.");

      // Recharge la liste des messages
      await fetchData();
    } catch (error) {
      setError(
        getApiErrorMessage(error, "Erreur lors de la suppression du message"),
      );
    }
  };

  /**
   * Affichage pendant le chargement initial
   */
  if (loading) {
    return <p>Chargement des messages...</p>;
  }

  /**
   * Affichage si le groupe n'a pas été trouvé
   */
  if (!group) {
    return <p>Groupe introuvable.</p>;
  }

  return (
    <div>
      {/* Lien retour vers la page de détail du groupe */}
      <Link
        to={`/groups/${groupId}`}
        className="mb-6 inline-block text-sm font-medium text-blue-600"
      >
        ← Retour au groupe
      </Link>

      {/* En-tête de la messagerie */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold sm:text-3xl">
          SkillBridge - Messagerie collaborative
        </h1>

        <p className="mt-2 text-slate-600">
          Échange directement avec les membres de ton groupe.
        </p>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Message de succès */}
      {success && (
        <div className="mb-4 rounded-lg bg-green-100 p-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* Layout principal : colonne membres + zone de messages */}
      <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        {/* Liste latérale des membres */}
        <aside className="rounded-2xl border bg-white p-4 shadow-sm sm:p-5">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />

            <h2 className="font-semibold">Membres du groupe</h2>
          </div>

          <ul className="mt-5 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-1">
            {group.members.map((member) => (
              <li key={member.id} className="flex items-center gap-2">
                {/* Petit point bleu représentant un membre */}
                <span className="h-2 w-2 rounded-full bg-blue-600" />

                <span>
                  {member.firstname} {member.lastname}
                  {/* Mention spéciale pour l'utilisateur connecté */}
                  {member.id === user?.id ? " (moi)" : ""}
                </span>
              </li>
            ))}
          </ul>
        </aside>

        {/* Bloc principal de messagerie */}
        <section className="flex h-[calc(100vh-17rem)] min-h-[520px] flex-col rounded-2xl border bg-white shadow-sm sm:h-[650px]">
          {/* En-tête de la conversation */}
          <div className="border-b px-4 py-4 text-center sm:px-6">
            <h2 className="text-lg font-semibold">{group.name}</h2>

            <p className="text-sm text-slate-500">
              {messages.length} message(s)
            </p>
          </div>

          {/* Zone scrollable des messages */}
          <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
            {messages.length === 0 ? (
              // Affichage lorsqu'aucun message n'a encore été envoyé
              <div className="flex h-full items-center justify-center text-center text-slate-500">
                Aucun message pour le moment. Écris le premier message du
                groupe.
              </div>
            ) : (
              // Affichage des messages
              messages.map((message) => {
                // Vérifie si le message appartient à l'utilisateur connecté
                const isMine = message.userId === user?.id;

                return (
                  <div
                    key={message.id}
                    className={`rounded-lg border p-3 sm:p-4 ${
                      isMine ? "border-blue-200 bg-blue-50" : "bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 sm:gap-4">
                      <p className="min-w-0 break-words text-sm">
                        <strong>
                          {isMine
                            ? "Moi"
                            : message.author
                              ? `${message.author.firstname} ${message.author.lastname}`
                              : "Utilisateur inconnu"}
                          {" : "}
                        </strong>

                        {/* whitespace-pre-wrap conserve les retours à la ligne du message */}
                        <span className="whitespace-pre-wrap">
                          {message.content}
                        </span>
                      </p>

                      {/* Bouton visible uniquement si l'utilisateur peut supprimer le message */}
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

                    {/* Date d'envoi du message */}
                    <p className="mt-2 text-right text-xs text-slate-500">
                      {new Date(message.createdAt).toLocaleString()}
                    </p>
                  </div>
                );
              })
            )}

            {/* Élément invisible servant d'ancre pour le scroll automatique */}
            <div ref={bottomRef} />
          </div>

          {/* Formulaire d'envoi de message */}
          <form onSubmit={handleSendMessage} className="border-t p-3 sm:p-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={1000}
                placeholder="Écrire un message..."
                className="min-h-12 min-w-0 flex-1 rounded-lg border px-4 py-3"
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

            {/* Compteur de caractères */}
            <p className="mt-2 text-right text-xs text-slate-500">
              {content.length}/1000
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}
