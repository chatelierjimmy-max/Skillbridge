import { useEffect, useState } from "react";
import { Bell, CheckCircle2 } from "lucide-react";

import { notificationService } from "../../services/notification.service";
import type { AppNotification } from "../../types/notification.type";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getMyNotifications();
      setNotifications(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleRead = async (id: string) => {
    await notificationService.markAsRead(id);
    await fetchNotifications();
  };

  if (loading) {
    return <p>Chargement des notifications...</p>;
  }

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Notifications</h1>

        <p className="mt-2 text-slate-600">
          {unreadCount} notification(s) non lue(s).
        </p>
      </div>

      {notifications.length === 0 ? (
        <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
          <Bell className="mx-auto mb-3 h-8 w-8 text-slate-400" />

          <p className="font-medium">Aucune notification.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <article
              key={notification._id}
              className={`rounded-2xl border bg-white p-5 shadow-sm ${
                !notification.isRead ? "border-blue-300" : ""
              }`}
            >
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <Bell
                      className={`h-5 w-5 ${
                        notification.isRead ? "text-slate-400" : "text-blue-600"
                      }`}
                    />

                    <h2 className="font-semibold">{notification.title}</h2>

                    {!notification.isRead && (
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                        Nouveau
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-sm text-slate-600">
                    {notification.content}
                  </p>

                  <p className="mt-3 text-xs text-slate-400">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>

                {!notification.isRead && (
                  <button
                    onClick={() => handleRead(notification._id)}
                    className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Marquer comme lue
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
