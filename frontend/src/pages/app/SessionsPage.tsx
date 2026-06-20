// Importation des hooks React
// useState : permet de gérer les états locaux du composant
// useEffect : permet d'exécuter une action lors du montage du composant
import { useEffect, useState } from "react";

// Importation des icônes utilisées dans l'affichage des sessions
import { Calendar, Clock, Video } from "lucide-react";

// Link permet de naviguer vers une autre page sans rechargement
import { Link } from "react-router-dom";

// Service API responsable de la gestion des sessions
import { sessionService } from "../../services/session.service";

// Type représentant une session à laquelle l'utilisateur est inscrit
import type { MySession } from "../../types/session.type";

// Utilitaire permettant de convertir une erreur API en message lisible
import { getApiErrorMessage } from "../../utils/apiError";

// Page affichant les sessions auxquelles l'utilisateur participe
export default function SessionsPage() {
  // Liste des sessions de l'utilisateur
  const [sessions, setSessions] = useState<MySession[]>([]);

  // État indiquant si les données sont en cours de chargement
  const [loading, setLoading] = useState(true);

  // Message de succès affiché après certaines actions
  const [message, setMessage] = useState("");

  // Message d'erreur affiché en cas de problème
  const [error, setError] = useState("");

  /**
   * Récupère toutes les sessions auxquelles
   * l'utilisateur est actuellement inscrit.
   */
  const fetchSessions = async () => {
    try {
      // Appel API
      const data = await sessionService.getMySessions();

      // Mise à jour de la liste des sessions
      setSessions(data);
    } finally {
      // Fin du chargement
      setLoading(false);
    }
  };

  /**
   * Chargement initial des sessions
   * lors de l'ouverture de la page.
   */
  useEffect(() => {
    fetchSessions();
  }, []);

  /**
   * Annule l'inscription de l'utilisateur à une session.
   *
   * @param sessionId Identifiant de la session concernée
   */
  const handleCancel = async (sessionId: number) => {
    try {
      // Réinitialisation des anciens messages
      setError("");
      setMessage("");

      // Appel API pour annuler la réservation
      await sessionService.cancelBooking(sessionId);

      // Message de confirmation
      setMessage("Participation annulée.");

      // Rechargement des données pour mettre à jour l'interface
      await fetchSessions();
    } catch (error) {
      setError(getApiErrorMessage(error, "Erreur lors de l’annulation"));
    }
  };

  /**
   * Affichage pendant le chargement des données.
   */
  if (loading) {
    return <p>Chargement de mes sessions...</p>;
  }

  return (
    <div>
      {/* En-tête de la page */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Mes sessions</h1>

        <p className="mt-2 text-slate-600">
          Retrouve les sessions auxquelles tu es inscrit.
        </p>
      </div>

      {/* Message de succès */}
      {message && (
        <div className="mb-4 rounded-lg bg-green-100 p-3 text-sm text-green-700">
          {message}
        </div>
      )}

      {/* Message d'erreur */}
      {error && (
        <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Cas où l'utilisateur n'est inscrit à aucune session */}
      {sessions.length === 0 ? (
        <div className="rounded-2xl border bg-white p-6 text-center shadow-sm sm:p-8">
          <p className="font-medium">Tu n’es inscrit à aucune session.</p>

          {/* Lien vers la liste des groupes pour découvrir des sessions */}
          <Link
            to="/groups"
            className="mt-4 inline-block rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition-colors duration-200 hover:bg-blue-700"
          >
            Voir les groupes
          </Link>
        </div>
      ) : (
        // Affichage des sessions sous forme de grille responsive
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sessions.map((session) => (
            <article
              key={session.id}
              className="rounded-2xl border bg-white p-4 shadow-sm sm:p-6"
            >
              {/* Titre de la session */}
              <h2 className="text-lg font-semibold">{session.title}</h2>

              {/* Description de la session */}
              <p className="mt-2 text-sm text-slate-600">
                {session.description || "Aucune description."}
              </p>

              {/* Informations principales */}
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                {/* Date et heure */}
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />

                  {new Date(session.startDate).toLocaleString()}
                </p>

                {/* Durée */}
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {session.duration} minutes
                </p>
              </div>

              {/* Informations sur le groupe associé */}
              <div className="mt-4 rounded-lg bg-slate-100 p-3 text-sm text-slate-700">
                <p>
                  <strong>Groupe :</strong> {session.group.name}
                </p>

                <p>
                  <strong>Compétence :</strong> {session.group.skill}
                </p>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link
                  to={`/sessions/${session.id}/video`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-700 sm:w-auto"
                >
                  <Video className="h-4 w-4" />
                  Rejoindre la visio
                </Link>

                <button
                  onClick={() => handleCancel(session.id)}
                  className="w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-red-700 sm:w-auto"
                >
                  Annuler ma participation
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
