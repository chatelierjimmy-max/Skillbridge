import { useEffect, useState } from "react";
import { Shield, UserX, UserCheck } from "lucide-react";

import { adminService } from "../../services/admin.service";
import type { AdminUser } from "../../types/admin.type";
import { getApiErrorMessage } from "../../utils/apiError";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      const data = await adminService.getUsers();
      setUsers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDisable = async (id: number) => {
    try {
      setError("");
      setMessage("");

      await adminService.disableUser(id);

      setMessage("Utilisateur désactivé.");
      await fetchUsers();
    } catch (error) {
      setError(getApiErrorMessage(error, "Erreur lors de la désactivation"));
    }
  };

  const handleEnable = async (id: number) => {
    try {
      setError("");
      setMessage("");

      await adminService.enableUser(id);

      setMessage("Utilisateur réactivé.");
      await fetchUsers();
    } catch (error) {
      setError(getApiErrorMessage(error, "Erreur lors de la réactivation"));
    }
  };

  if (loading) {
    return <p>Chargement des utilisateurs...</p>;
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-blue-600" />

          <div>
            <h1 className="text-3xl font-bold">Administration utilisateurs</h1>

            <p className="mt-2 text-slate-600">
              Gestion des comptes inscrits sur SkillBridge.
            </p>
          </div>
        </div>
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

      <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="border-b px-6 py-4">
          <h2 className="text-xl font-semibold">Liste des utilisateurs</h2>

          <p className="text-sm text-slate-500">
            {users.length} utilisateur(s)
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-6 py-3">Utilisateur</th>
                <th className="px-6 py-3">Rôle</th>
                <th className="px-6 py-3">Statut</th>
                <th className="px-6 py-3">Ville</th>
                <th className="px-6 py-3">Inscription</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4">
                    <p className="font-medium">
                      {user.firstname} {user.lastname}
                    </p>

                    <p className="text-slate-500">{user.email}</p>
                  </td>

                  <td className="px-6 py-4">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">
                      {user.role}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        user.status === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td className="px-6 py-4">{user.profile?.location || "—"}</td>

                  <td className="px-6 py-4">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 text-right">
                    {user.role === "ADMIN" ? (
                      <span className="text-xs text-slate-400">Protégé</span>
                    ) : user.status === "ACTIVE" ? (
                      <button
                        onClick={() => handleDisable(user.id)}
                        className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white"
                      >
                        <UserX className="h-4 w-4" />
                        Désactiver
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEnable(user.id)}
                        className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white"
                      >
                        <UserCheck className="h-4 w-4" />
                        Réactiver
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
