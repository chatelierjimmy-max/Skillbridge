import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Calendar, MessageCircle, Users } from "lucide-react";

import { groupService } from "../../services/group.service";
import type { GroupDetail } from "../../types/group.type";
import { useAuth } from "../../hooks/useAuth";
import { levelLabel } from "../../utils/levelLabel";
import { getApiErrorMessage } from "../../utils/apiError";

export default function GroupDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();

  const [group, setGroup] = useState<GroupDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const groupId = Number(id);

  const fetchGroup = useCallback(async () => {
    try {
      const data = await groupService.getGroupById(groupId);
      setGroup(data);
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    void fetchGroup();
  }, [fetchGroup]);

  const isMember = group?.members.some((member) => member.id === user?.id);

  const isOwner = group?.owner.id === user?.id;

  const handleJoin = async () => {
    try {
      setError("");
      setMessage("");

      await groupService.joinGroup(groupId);

      setMessage("Vous avez rejoint le groupe.");
      await fetchGroup();
    } catch (error) {
      setError(
        getApiErrorMessage(error, "Erreur lors de l'inscription au groupe"),
      );
    }
  };

  const handleLeave = async () => {
    try {
      setError("");
      setMessage("");

      await groupService.leaveGroup(groupId);

      setMessage("Vous avez quitté le groupe.");
      await fetchGroup();
    } catch (error) {
      setError(
        getApiErrorMessage(error, "Erreur lors de la sortie du groupe"),
      );
    }
  };

  if (loading) {
    return <p>Chargement du groupe...</p>;
  }

  if (!group) {
    return <p>Groupe introuvable.</p>;
  }

  return (
    <div>
      <Link
        to="/groups"
        className="mb-6 inline-block text-sm font-medium text-blue-600"
      >
        ← Retour aux groupes
      </Link>

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
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
          <div>
            <h1 className="text-3xl font-bold">{group.name}</h1>

            <p className="mt-2 text-slate-600">
              {group.description || "Aucune description."}
            </p>

            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-700">
                {group.skill.name}
              </span>

              {group.level && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                  {levelLabel[group.level]}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            {!isMember && (
              <button
                onClick={handleJoin}
                className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white"
              >
                Rejoindre
              </button>
            )}

            {isMember && !isOwner && (
              <button
                onClick={handleLeave}
                className="rounded-lg bg-red-600 px-5 py-3 font-medium text-white"
              >
                Quitter
              </button>
            )}

            {isOwner && (
              <span className="rounded-lg bg-slate-100 px-5 py-3 text-sm font-medium text-slate-700">
                Propriétaire
              </span>
            )}
          </div>
        </div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-5 flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold">Membres du groupe</h2>
          </div>

          <div className="space-y-3">
            {group.members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <p className="font-medium">
                    {member.firstname} {member.lastname}
                  </p>

                  <p className="text-sm text-slate-500">{member.email}</p>
                </div>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        </section>

        <aside className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Actions</h2>

          <div className="mt-5 space-y-3">
            <Link
              to={`/groups/${group.id}/sessions`}
              className="flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium"
            >
              <Calendar className="h-4 w-4" />
              Sessions du groupe
            </Link>

            <Link
              to={`/groups/${group.id}/messages`}
              className="flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium"
            >
              <MessageCircle className="h-4 w-4" />
              Messagerie
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
