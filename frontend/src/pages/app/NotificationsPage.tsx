// Importation des hooks React
// useState : permet de stocker des données locales au composant
// useEffect : permet d'exécuter une action lors du montage du composant
import { useEffect, useState } from "react";

// Importation des icônes Lucide React
// Bell : icône de notification
// CheckCircle2 : icône utilisée pour marquer une notification comme lue
import { Bell, CheckCircle2 } from "lucide-react";

// Service chargé des appels API liés aux notifications
import { notificationService } from "../../services/notification.service";

// Type représentant une notification dans l'application
import type { AppNotification } from "../../types/notification.type";

// Page de consultation des notifications utilisateur
export default function NotificationsPage() {
  // Liste des notifications récupérées depuis l'API
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // État indiquant si les notifications sont en cours de chargement
  const [loading, setLoading] = useState(true);

  /**
   * Récupère toutes les notifications de l'utilisateur connecté.
   */
  const fetchNotifications = async () => {
    try {
      // Appel API
      const data = await notificationService.getMyNotifications();

      // Mise à jour de l'état local
      setNotifications(data);
    } finally {
      // Fin du chargement
      setLoading(false);
    }
  };

  /**
   * Chargement des notifications lors de l'ouverture de la page.
   */
  useEffect(() => {
    fetchNotifications();
  }, []);

  /**
   * Marque une notification comme lue.
   *
   * @param id Identifiant MongoDB de la notification
   */
  const handleRead = async (id: string) => {
    // Mise à jour côté API
    await notificationService.markAsRead(id);

    // Rechargement de la liste pour refléter les changements
    await fetchNotifications();
  };

  /**
   * Affichage pendant le chargement initial.
   */
  if (loading) {
    return <p>Chargement des notifications...</p>;
  }

  /**
   * Calcul du nombre de notifications non lues.
   *
   * filter conserve uniquement les notifications dont isRead vaut false.
   * length permet ensuite de compter le résultat.
   */
  const unreadCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  return (
    <div>
      {/* En-tête de la page */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Notifications</h1>

        <p className="mt-2 text-slate-600">
          {unreadCount} notification(s) non lue(s).
        </p>
      </div>

      {/* Cas où aucune notification n'existe */}
      {notifications.length === 0 ? (
        <div className="rounded-2xl border bg-white p-6 text-center shadow-sm sm:p-8">
          {/* Icône décorative */}
          <Bell className="mx-auto mb-3 h-8 w-8 text-slate-400" />

          <p className="font-medium">Aucune notification.</p>
        </div>
      ) : (
        // Liste des notifications
        <div className="space-y-4">
          {notifications.map((notification) => (
            <article
              key={notification._id}
              className={`rounded-2xl border bg-white p-4 shadow-sm sm:p-5 ${
                // Bordure bleue pour les notifications non lues
                !notification.isRead ? "border-blue-300" : ""
              }`}
            >
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                {/* Contenu principal */}
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Icône de notification */}
                    <Bell
                      className={`h-5 w-5 ${
                        notification.isRead ? "text-slate-400" : "text-blue-600"
                      }`}
                    />

                    {/* Titre de la notification */}
                    <h2 className="font-semibold">{notification.title}</h2>

                    {/* Badge affiché uniquement si la notification n'a pas été lue */}
                    {!notification.isRead && (
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                        Nouveau
                      </span>
                    )}
                  </div>

                  {/* Corps de la notification */}
                  <p className="mt-2 text-sm text-slate-600">
                    {notification.content}
                  </p>

                  {/* Date de création */}
                  <p className="mt-3 text-xs text-slate-400">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* Bouton de marquage comme lue */}
                {/* Visible uniquement si la notification est encore non lue */}
                {!notification.isRead && (
                  <button
                    onClick={() => handleRead(notification._id)}
                    className="flex flex-wrap items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-700"
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
