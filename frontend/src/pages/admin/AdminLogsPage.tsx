import { useEffect, useState } from "react";
import { Activity, ShieldAlert } from "lucide-react";

import { adminService } from "../../services/admin.service";
import type { ActivityLog, SecurityLog } from "../../types/admin.type";

export default function AdminLogsPage() {
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);
  const [activeTab, setActiveTab] = useState<"activity" | "security">(
    "activity",
  );
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const [activityData, securityData] = await Promise.all([
        adminService.getActivityLogs(),
        adminService.getSecurityLogs(),
      ]);

      setActivityLogs(activityData);
      setSecurityLogs(securityData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  if (loading) {
    return <p>Chargement des logs...</p>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Logs MongoDB</h1>

        <p className="mt-2 text-slate-600">
          Consultation des logs d’activité et de sécurité.
        </p>
      </div>

      <div className="mb-6 flex gap-3">
        <button
          onClick={() => setActiveTab("activity")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${
            activeTab === "activity"
              ? "bg-blue-600 text-white"
              : "border bg-white"
          }`}
        >
          <Activity className="h-4 w-4" />
          Activité
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${
            activeTab === "security"
              ? "bg-blue-600 text-white"
              : "border bg-white"
          }`}
        >
          <ShieldAlert className="h-4 w-4" />
          Sécurité
        </button>
      </div>

      {activeTab === "activity" && (
        <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="border-b px-6 py-4">
            <h2 className="text-xl font-semibold">Logs d’activité</h2>

            <p className="text-sm text-slate-500">
              {activityLogs.length} entrée(s)
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-6 py-3">Action</th>
                  <th className="px-6 py-3">Utilisateur</th>
                  <th className="px-6 py-3">Cible</th>
                  <th className="px-6 py-3">IP</th>
                  <th className="px-6 py-3">Date</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {activityLogs.map((log) => (
                  <tr key={log._id}>
                    <td className="px-6 py-4 font-medium">{log.action}</td>

                    <td className="px-6 py-4">{log.userId || "—"}</td>

                    <td className="px-6 py-4">
                      {log.targetType || "—"}{" "}
                      {log.targetId ? `#${log.targetId}` : ""}
                    </td>

                    <td className="px-6 py-4">{log.ipAddress || "—"}</td>

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

      {activeTab === "security" && (
        <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="border-b px-6 py-4">
            <h2 className="text-xl font-semibold">Logs de sécurité</h2>

            <p className="text-sm text-slate-500">
              {securityLogs.length} entrée(s)
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-6 py-3">Événement</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Raison</th>
                  <th className="px-6 py-3">IP</th>
                  <th className="px-6 py-3">Date</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {securityLogs.map((log) => (
                  <tr key={log._id}>
                    <td className="px-6 py-4 font-medium">{log.event}</td>

                    <td className="px-6 py-4">{log.email || "—"}</td>

                    <td className="px-6 py-4">{log.reason || "—"}</td>

                    <td className="px-6 py-4">{log.ipAddress || "—"}</td>

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
