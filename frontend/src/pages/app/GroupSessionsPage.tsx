import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Calendar, Clock, Users } from "lucide-react";

import { sessionService } from "../../services/session.service";
import type { GroupSession } from "../../types/session.type";
import { getApiErrorMessage } from "../../utils/apiError";

export default function GroupSessionsPage() {
  const { id } = useParams();

  const groupId = Number(id);

  const [sessions, setSessions] = useState<GroupSession[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [duration, setDuration] = useState(90);
  const [maxParticipants, setMaxParticipants] = useState(8);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchSessions = useCallback(async () => {
    try {
      const data = await sessionService.getGroupSessions(groupId);
      setSessions(data);
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    void fetchSessions();
  }, [fetchSessions]);

  const handleCreateSession = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setError("");
      setMessage("");

      await sessionService.createSession(groupId, {
        title,
        description,
        startDate: new Date(startDate).toISOString(),
        duration,
        maxParticipants,
      });

      setTitle("");
      setDescription("");
      setStartDate("");
      setDuration(90);
      setMaxParticipants(8);

      setMessage("Session créée avec succès.");

      await fetchSessions();
    } catch (error) {
      setError(getApiErrorMessage(error, "Erreur lors de la création de la session"));
    }
  };

  const handleBook = async (sessionId: number) => {
    try {
      setError("");
      setMessage("");

      await sessionService.bookSession(sessionId);

      setMessage("Inscription confirmée.");

      await fetchSessions();
    } catch (error) {
      setError(getApiErrorMessage(error, "Erreur lors de l’inscription"));
    }
  };

  if (loading) {
    return <p>Chargement des sessions...</p>;
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
        <h1 className="text-3xl font-bold">Sessions du groupe</h1>

        <p className="mt-2 text-slate-600">
          Planifie ou rejoins une session de travail.
        </p>
      </div>

      {message && (
        <div className="mb-4 rounded-lg bg-green-100 p-3 text-sm text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Créer une session</h2>

        <form
          onSubmit={handleCreateSession}
          className="mt-6 grid gap-4 md:grid-cols-2"
        >
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

          <div className="md:col-span-2">
            <button className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white">
              Créer la session
            </button>
          </div>
        </form>
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">Sessions disponibles</h2>

        {sessions.length === 0 ? (
          <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
            Aucune session disponible.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {sessions.map((session) => (
              <article
                key={session.id}
                className="rounded-2xl border bg-white p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold">{session.title}</h3>

                <p className="mt-2 text-sm text-slate-600">
                  {session.description || "Aucune description."}
                </p>

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

                <p className="mt-4 text-xs text-slate-500">
                  Créée par {session.creator.firstname}{" "}
                  {session.creator.lastname}
                </p>

                {session.isRegistered ? (
                  <span className="mt-5 inline-block rounded-lg bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
                    Inscrit
                  </span>
                ) : (
                  <button
                    onClick={() => handleBook(session.id)}
                    className="mt-5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
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
