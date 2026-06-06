// Importation des hooks React
// useState permet de gérer l'état local du composant
// useEffect permet d'exécuter du code lors du cycle de vie du composant
import { useEffect, useState } from "react";

// Importation des icônes depuis Lucide React
// Activity : icône représentant l'activité
// ShieldAlert : icône représentant la sécurité
import { Activity, ShieldAlert } from "lucide-react";

// Service permettant de communiquer avec l'API d'administration
import { adminService } from "../../services/admin.service";

// Types TypeScript représentant les logs récupérés depuis l'API
import type { ActivityLog, SecurityLog } from "../../types/admin.type";

// Composant de consultation des logs administrateur
export default function AdminLogsPage() {
  // Liste des logs d'activité
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  // Liste des logs de sécurité
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);

  // Onglet actuellement affiché
  // activity = logs d'activité
  // security = logs de sécurité
  const [activeTab, setActiveTab] = useState<"activity" | "security">(
    "activity",
  );

  // État de chargement des données
  const [loading, setLoading] = useState(true);

  /**
   * Récupération des logs depuis l'API
   */
  const fetchLogs = async () => {
    try {
      // Exécute les deux requêtes en parallèle
      // Promise.all améliore les performances
      const [activityData, securityData] = await Promise.all([
        adminService.getActivityLogs(),
        adminService.getSecurityLogs(),
      ]);

      // Mise à jour des états avec les données reçues
      setActivityLogs(activityData);
      setSecurityLogs(securityData);
    } finally {
      // Le chargement est terminé même en cas d'erreur
      setLoading(false);
    }
  };

  /**
   * Exécuté au montage du composant
   * Le tableau vide [] signifie :
   * - exécuté une seule fois
   * - équivalent du componentDidMount()
   */
  useEffect(() => {
    fetchLogs();
  }, []);

  /**
   * Affichage pendant le chargement
   */
  if (loading) {
    return <p>Chargement des logs...</p>;
  }

  return (
    <div>
      {/* Titre principal de la page */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Logs MongoDB</h1>

        <p className="mt-2 text-slate-600">
          Consultation des logs d’activité et de sécurité.
        </p>
      </div>

      {/* Boutons de navigation entre les onglets */}
      <div className="mb-6 flex gap-3">
        {/* Bouton Activité */}
        <button
          onClick={() => setActiveTab("activity")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 ${
            activeTab === "activity"
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "border bg-white hover:bg-blue-50"
          }`}
        >
          <Activity className="h-4 w-4" />
          Activité
        </button>

        {/* Bouton Sécurité */}
        <button
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 ${
            activeTab === "security"
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "border bg-white hover:bg-blue-50"
          }`}
        >
          <ShieldAlert className="h-4 w-4" />
          Sécurité
        </button>
      </div>

      {/* ========================= */}
      {/* ONGLET LOGS D'ACTIVITÉ */}
      {/* ========================= */}

      {activeTab === "activity" && (
        <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          {/* En-tête du tableau */}
          <div className="border-b px-6 py-4">
            <h2 className="text-xl font-semibold">Logs d’activité</h2>

            <p className="text-sm text-slate-500">
              {activityLogs.length} entrée(s)
            </p>
          </div>

          {/* Tableau responsive */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              {/* Colonnes */}
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-6 py-3">Action</th>
                  <th className="px-6 py-3">Utilisateur</th>
                  <th className="px-6 py-3">Cible</th>
                  <th className="px-6 py-3">IP</th>
                  <th className="px-6 py-3">Date</th>
                </tr>
              </thead>

              {/* Contenu du tableau */}
              <tbody className="divide-y">
                {/* Parcours de chaque log d'activité */}
                {activityLogs.map((log) => (
                  <tr key={log._id}>
                    {/* Action réalisée */}
                    <td className="px-6 py-4 font-medium">{log.action}</td>

                    {/* Identifiant utilisateur */}
                    <td className="px-6 py-4">{log.userId || "—"}</td>

                    {/* Ressource ciblée */}
                    <td className="px-6 py-4">
                      {log.targetType || "—"}{" "}
                      {log.targetId ? `#${log.targetId}` : ""}
                    </td>

                    {/* Adresse IP */}
                    <td className="px-6 py-4">{log.ipAddress || "—"}</td>

                    {/* Date formatée */}
                    <td className="px-6 py-4">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ========================= */}
      {/* ONGLET LOGS DE SÉCURITÉ */}
      {/* ========================= */}

      {activeTab === "security" && (
        <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          {/* En-tête du tableau */}
          <div className="border-b px-6 py-4">
            <h2 className="text-xl font-semibold">Logs de sécurité</h2>

            <p className="text-sm text-slate-500">
              {securityLogs.length} entrée(s)
            </p>
          </div>

          {/* Tableau responsive */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              {/* Colonnes */}
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-6 py-3">Événement</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Raison</th>
                  <th className="px-6 py-3">IP</th>
                  <th className="px-6 py-3">Date</th>
                </tr>
              </thead>

              {/* Contenu du tableau */}
              <tbody className="divide-y">
                {/* Parcours des logs de sécurité */}
                {securityLogs.map((log) => (
                  <tr key={log._id}>
                    {/* Type d'événement */}
                    <td className="px-6 py-4 font-medium">{log.event}</td>

                    {/* Adresse email concernée */}
                    <td className="px-6 py-4">{log.email || "—"}</td>

                    {/* Motif de l'événement */}
                    <td className="px-6 py-4">{log.reason || "—"}</td>

                    {/* Adresse IP */}
                    <td className="px-6 py-4">{log.ipAddress || "—"}</td>

                    {/* Date de création */}
                    <td className="px-6 py-4">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
