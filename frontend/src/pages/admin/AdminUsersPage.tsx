// Importation des hooks React
// useState : gestion des états locaux du composant
// useEffect : exécution de code lors du cycle de vie du composant
import { useEffect, useState } from "react";

// Importation des icônes Lucide React
// Shield : icône administration
// UserX : désactivation utilisateur
// UserCheck : réactivation utilisateur
import { Shield, UserX, UserCheck } from "lucide-react";

// Service chargé des appels API administrateur
import { adminService } from "../../services/admin.service";

// Type représentant un utilisateur côté administration
import type { AdminUser } from "../../types/admin.type";

// Fonction utilitaire permettant de récupérer un message d'erreur lisible
import { getApiErrorMessage } from "../../utils/apiError";

// Page d'administration des utilisateurs
export default function AdminUsersPage() {
  // Liste des utilisateurs récupérés depuis l'API
  const [users, setUsers] = useState<AdminUser[]>([]);

  // Indique si les données sont en cours de chargement
  const [loading, setLoading] = useState(true);

  // Message de succès affiché à l'utilisateur
  const [message, setMessage] = useState("");

  // Message d'erreur affiché à l'utilisateur
  const [error, setError] = useState("");

  /**
   * Récupération de tous les utilisateurs
   */
  const fetchUsers = async () => {
    try {
      // Appel API pour récupérer les utilisateurs
      const data = await adminService.getUsers();

      // Mise à jour de l'état local
      setUsers(data);
    } finally {
      // Fin du chargement même en cas d'erreur
      setLoading(false);
    }
  };

  /**
   * Chargement initial lors de l'ouverture de la page
   */
  useEffect(() => {
    fetchUsers();
  }, []);

  /**
   * Désactivation d'un utilisateur
   *
   * @param id Identifiant utilisateur
   */
  const handleDisable = async (id: number) => {
    try {
      // Réinitialisation des messages
      setError("");
      setMessage("");

      // Appel API de désactivation
      await adminService.disableUser(id);

      // Message de confirmation
      setMessage("Utilisateur désactivé.");

      // Rafraîchissement de la liste
      await fetchUsers();
    } catch (error) {
      // Gestion des erreurs
      setError(getApiErrorMessage(error, "Erreur lors de la désactivation"));
    }
  };

  /**
   * Réactivation d'un utilisateur
   *
   * @param id Identifiant utilisateur
   */
  const handleEnable = async (id: number) => {
    try {
      // Réinitialisation des messages
      setError("");
      setMessage("");

      // Appel API de réactivation
      await adminService.enableUser(id);

      // Message de confirmation
      setMessage("Utilisateur réactivé.");

      // Mise à jour de la liste
      await fetchUsers();
    } catch (error) {
      // Gestion des erreurs
      setError(getApiErrorMessage(error, "Erreur lors de la réactivation"));
    }
  };

  /**
   * Affichage pendant le chargement
   */
  if (loading) {
    return <p>Chargement des utilisateurs...</p>;
  }

  return (
    <div>
      {/* En-tête de la page */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          {/* Icône administration */}
          <Shield className="h-8 w-8 text-blue-600" />

          <div>
            {/* Titre principal */}
            <h1 className="text-3xl font-bold">Administration utilisateurs</h1>

            {/* Description */}
            <p className="mt-2 text-slate-600">
              Gestion des comptes inscrits sur SkillBridge.
            </p>
          </div>
        </div>
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

      {/* Carte contenant le tableau des utilisateurs */}
      <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        {/* En-tête du tableau */}
        <div className="border-b px-6 py-4">
          <h2 className="text-xl font-semibold">Liste des utilisateurs</h2>

          <p className="text-sm text-slate-500">
            {users.length} utilisateur(s)
          </p>
        </div>

        {/* Gestion du débordement horizontal sur petits écrans */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            {/* En-tête des colonnes */}
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

            {/* Corps du tableau */}
            <tbody className="divide-y">
              {/* Parcours de tous les utilisateurs */}
              {users.map((user) => (
                <tr key={user.id}>
                  {/* Informations principales */}
                  <td className="px-6 py-4">
                    <p className="font-medium">
                      {user.firstname} {user.lastname}
                    </p>

                    <p className="text-slate-500">{user.email}</p>
                  </td>

                  {/* Rôle utilisateur */}
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">
                      {user.role}
                    </span>
                  </td>

                  {/* Statut du compte */}
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

                  {/* Ville renseignée dans le profil */}
                  <td className="px-6 py-4">{user.profile?.location || "—"}</td>

                  {/* Date d'inscription */}
                  <td className="px-6 py-4">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>

                  {/* Actions administrateur */}
                  <td className="px-6 py-4 text-right">
                    {/* Protection contre la désactivation d'un administrateur */}
                    {user.role === "ADMIN" ? (
                      <span className="text-xs text-slate-400">Protégé</span>
                    ) : user.status === "ACTIVE" ? (
                      // Bouton désactivation
                      <button
                        onClick={() => handleDisable(user.id)}
                        className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white transition-colors duration-200 hover:bg-red-700"
                      >
                        <UserX className="h-4 w-4" />
                        Désactiver
                      </button>
                    ) : (
                      // Bouton réactivation
                      <button
                        onClick={() => handleEnable(user.id)}
                        className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white transition-colors duration-200 hover:bg-green-700"
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
