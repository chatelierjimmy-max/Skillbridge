import { useEffect, useState } from "react";
import { Calendar, Clock } from "lucide-react";
import { Link } from "react-router-dom";

import { sessionService } from "../../services/session.service";
import type { MySession } from "../../types/session.type";
import { getApiErrorMessage } from "../../utils/apiError";

export default function SessionsPage() {
  const [sessions, setSessions] = useState<MySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchSessions = async () => {
    try {
      const data = await sessionService.getMySessions();
      setSessions(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleCancel = async (sessionId: number) => {
    try {
      setError("");
      setMessage("");

      await sessionService.cancelBooking(sessionId);

      setMessage("Participation annulée.");

      await fetchSessions();
    } catch (error) {
      setError(getApiErrorMessage(error, "Erreur lors de l’annulation"));
    }
  };

  if (loading) {
    return <p>Chargement de mes sessions...</p>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Mes sessions</h1>

        <p className="mt-2 text-slate-600">
          Retrouve les sessions auxquelles tu es inscrit.
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

      {sessions.length === 0 ? (
        <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
          <p className="font-medium">Tu n’es inscrit à aucune session.</p>

          <Link
            to="/groups"
            className="mt-4 inline-block rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition-colors duration-200 hover:bg-blue-700"
          >
            Voir les groupes
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sessions.map((session) => (
            <article
              key={session.id}
              className="rounded-2xl border bg-white p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold">{session.title}</h2>

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
              </div>

              <div className="mt-4 rounded-lg bg-slate-100 p-3 text-sm text-slate-700">
                <p>
                  <strong>Groupe :</strong> {session.group.name}
                </p>

                <p>
                  <strong>Compétence :</strong> {session.group.skill}
                </p>
              </div>

              <button
                onClick={() => handleCancel(session.id)}
                className="mt-5 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-red-700"
              >
                Annuler ma participation
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
