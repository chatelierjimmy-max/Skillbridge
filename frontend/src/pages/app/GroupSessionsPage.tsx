// Importation des hooks React
// useState : permet de gérer les états locaux du composant
// useEffect : permet d'exécuter une action au montage du composant
// useCallback : permet de mémoriser une fonction entre les rendus
import { useCallback, useEffect, useState } from "react";

// Link permet de naviguer vers une autre page sans rechargement
// useParams permet de récupérer les paramètres présents dans l'URL
import { Link, useParams } from "react-router-dom";

// Importation des icônes utilisées dans les cartes de sessions
import { Calendar, Clock, Users } from "lucide-react";

// Service responsable des appels API liés aux sessions
import { sessionService } from "../../services/session.service";

// Type TypeScript représentant une session de groupe
import type { GroupSession } from "../../types/session.type";

// Utilitaire permettant de transformer une erreur API en message lisible
import { getApiErrorMessage } from "../../utils/apiError";

// Page affichant les sessions d'un groupe
export default function GroupSessionsPage() {
  // Récupération de l'id du groupe depuis l'URL
  // Exemple : /groups/4/sessions => id vaut "4"
  const { id } = useParams();

  // Conversion de l'id en nombre pour l'utiliser dans les appels API
  const groupId = Number(id);

  // Liste des sessions disponibles pour ce groupe
  const [sessions, setSessions] = useState<GroupSession[]>([]);

  // État indiquant si les sessions sont en cours de chargement
  const [loading, setLoading] = useState(true);

  // Champs du formulaire de création d'une session
  const [title, setTitle] = useState("");

  // Description facultative de la session
  const [description, setDescription] = useState("");

  // Date et heure choisies dans le formulaire
  const [startDate, setStartDate] = useState("");

  // Durée de la session en minutes
  // Valeur par défaut : 90 minutes
  const [duration, setDuration] = useState(90);

  // Nombre maximum de participants
  // Valeur par défaut : 8 participants
  const [maxParticipants, setMaxParticipants] = useState(8);

  // Message de succès affiché après une action
  const [message, setMessage] = useState("");

  // Message d'erreur affiché en cas de problème
  const [error, setError] = useState("");

  /**
   * Récupération des sessions du groupe depuis l'API.
   *
   * useCallback évite que la fonction soit recréée inutilement
   * à chaque rendu, sauf si groupId change.
   */
  const fetchSessions = useCallback(async () => {
    try {
      // Appel API pour récupérer les sessions du groupe
      const data = await sessionService.getGroupSessions(groupId);

      // Mise à jour de la liste des sessions
      setSessions(data);
    } finally {
      // Fin du chargement, même si l'appel échoue
      setLoading(false);
    }
  }, [groupId]);

  /**
   * Chargement initial des sessions
   * ou rechargement si l'id du groupe change.
   */
  useEffect(() => {
    // void indique explicitement qu'on ignore la Promise retournée
    void fetchSessions();
  }, [fetchSessions]);

  /**
   * Création d'une nouvelle session.
   *
   * @param event Événement de soumission du formulaire
   */
  const handleCreateSession = async (event: React.FormEvent) => {
    // Empêche le rechargement de la page
    event.preventDefault();

    try {
      // Réinitialisation des messages d'interface
      setError("");
      setMessage("");

      // Appel API pour créer une session dans le groupe
      await sessionService.createSession(groupId, {
        title,
        description,

        // Conversion de la date locale du champ datetime-local
        // en format ISO utilisable côté backend
        startDate: new Date(startDate).toISOString(),

        duration,
        maxParticipants,
      });

      // Réinitialisation du formulaire après création
      setTitle("");
      setDescription("");
      setStartDate("");
      setDuration(90);
      setMaxParticipants(8);

      // Message de confirmation
      setMessage("Session créée avec succès.");

      // Rechargement de la liste pour afficher la nouvelle session
      await fetchSessions();
    } catch (error) {
      setError(
        getApiErrorMessage(error, "Erreur lors de la création de la session"),
      );
    }
  };

  /**
   * Inscription de l'utilisateur à une session.
   *
   * @param sessionId Identifiant de la session choisie
   */
  const handleBook = async (sessionId: number) => {
    try {
      // Réinitialisation des anciens messages
      setError("");
      setMessage("");

      // Appel API pour s'inscrire à la session
      await sessionService.bookSession(sessionId);

      // Message de confirmation
      setMessage("Inscription confirmée.");

      // Rechargement des sessions pour mettre à jour l'état d'inscription
      await fetchSessions();
    } catch (error) {
      setError(getApiErrorMessage(error, "Erreur lors de l’inscription"));
    }
  };

  /**
   * Affichage pendant le chargement initial
   */
  if (loading) {
    return <p>Chargement des sessions...</p>;
  }

  return (
    <div>
      {/* Lien de retour vers la page du groupe */}
      <Link
        to={`/groups/${groupId}`}
        className="mb-6 inline-block text-sm font-medium text-blue-600"
      >
        ← Retour au groupe
      </Link>

      {/* En-tête de la page */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Sessions du groupe</h1>

        <p className="mt-2 text-slate-600">
          Planifie ou rejoins une session de travail.
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

      {/* Formulaire de création d'une session */}
      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Créer une session</h2>

        <form
          onSubmit={handleCreateSession}
          className="mt-6 grid gap-4 md:grid-cols-2"
        >
          {/* Champ titre */}
          <div>
            <label className="mb-1 block text-sm font-medium">Titre</label>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              minLength={3}
              className="w-full rounded-lg border px-4 py-3"
              placeholder="Introduction aux hooks React"
            />
          </div>

          {/* Champ date et heure */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Date et heure
            </label>

            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>

          {/* Champ durée */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Durée en minutes
            </label>

            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              min={15}
              max={480}
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>

          {/* Champ nombre maximum de participants */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Participants max
            </label>

            <input
              type="number"
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(Number(e.target.value))}
              min={1}
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>

          {/* Champ description */}
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-24 w-full rounded-lg border px-4 py-3"
              placeholder="Sujet de la session..."
            />
          </div>

          {/* Bouton de soumission */}
          <div className="md:col-span-2">
            <button className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition-colors duration-200 hover:bg-blue-700">
              Créer la session
            </button>
          </div>
        </form>
      </section>

      {/* Liste des sessions disponibles */}
      <section className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">Sessions disponibles</h2>

        {sessions.length === 0 ? (
          // Message si aucune session n'existe
          <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
            Aucune session disponible.
          </div>
        ) : (
          // Grille responsive des sessions
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {sessions.map((session) => (
              <article
                key={session.id}
                className="rounded-2xl border bg-white p-6 shadow-sm"
              >
                {/* Titre de la session */}
                <h3 className="text-lg font-semibold">{session.title}</h3>

                {/* Description */}
                <p className="mt-2 text-sm text-slate-600">
                  {session.description || "Aucune description."}
                </p>

                {/* Informations principales de la session */}
                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <p className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(session.startDate).toLocaleString()}
                  </p>

                  <p className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {session.duration} minutes
                  </p>

                  <p className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {session.registeredCount}
                    {session.maxParticipants
                      ? ` / ${session.maxParticipants}`
                      : ""}{" "}
                    participant(s)
                  </p>
                </div>

                {/* Créateur de la session */}
                <p className="mt-4 text-xs text-slate-500">
                  Créée par {session.creator.firstname}{" "}
                  {session.creator.lastname}
                </p>

                {/* État d'inscription */}
                {session.isRegistered ? (
                  <span className="mt-5 inline-block rounded-lg bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
                    Inscrit
                  </span>
                ) : (
                  <button
                    onClick={() => handleBook(session.id)}
                    className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-700"
                  >
                    S’inscrire
                  </button>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
