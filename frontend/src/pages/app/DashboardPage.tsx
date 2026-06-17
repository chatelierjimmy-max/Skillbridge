// Importation des hooks React
// useState : gestion des états locaux
// useEffect : exécution d'actions lors du cycle de vie du composant
import { useEffect, useState } from "react";

// Importation des icônes Lucide utilisées dans les cartes statistiques
import { Calendar, MessageCircle, Users, Bell } from "lucide-react";

// Link permet la navigation entre les pages sans rechargement
import { Link } from "react-router-dom";

// Hook personnalisé permettant d'accéder aux informations de l'utilisateur connecté
import { useAuth } from "../../hooks/useAuth";

// Services permettant de communiquer avec l'API
import { profileService } from "../../services/profile.service";
import { skillService } from "../../services/skill.service";
import { sessionService } from "../../services/session.service";
import { notificationService } from "../../services/notification.service";
import { groupService } from "../../services/group.service";

// Types TypeScript utilisés pour typer les données récupérées
import type { Profile } from "../../types/profile.type";
import type { UserSkill } from "../../types/skill.type";
import type { MySession } from "../../types/session.type";
import type { AppNotification } from "../../types/notification.type";
import type { MyGroup } from "../../types/group.type";

// Composant principal du tableau de bord
export default function DashboardPage() {
  // Récupération des informations de l'utilisateur connecté
  const { user } = useAuth();

  // État contenant le profil utilisateur
  const [profile, setProfile] = useState<Profile | null>(null);

  // Liste des compétences de l'utilisateur
  const [skills, setSkills] = useState<UserSkill[]>([]);

  // Liste des sessions auxquelles l'utilisateur participe
  const [sessions, setSessions] = useState<MySession[]>([]);

  // Liste des notifications
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // Liste des groupes de l'utilisateur
  const [groups, setGroups] = useState<MyGroup[]>([]);

  // État indiquant si les données sont en cours de chargement
  const [loading, setLoading] = useState(true);

  /**
   * Chargement initial des données du dashboard
   */
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // Exécution parallèle de toutes les requêtes API
        // Promise.all améliore les performances
        const [
          profileData,
          skillsData,
          sessionsData,
          notificationsData,
          groupsData,
        ] = await Promise.all([
          profileService.getMyProfile(),
          skillService.getMySkills(),
          sessionService.getMySessions(),
          notificationService.getMyNotifications(),
          groupService.getMyGroups(),
        ]);

        // Mise à jour des états avec les données reçues
        setProfile(profileData);
        setSkills(skillsData);
        setSessions(sessionsData);
        setNotifications(notificationsData);
        setGroups(groupsData);
      } finally {
        // Fin du chargement
        setLoading(false);
      }
    };

    // Exécution de la récupération des données
    fetchDashboard();
  }, []);

  /**
   * Affichage pendant le chargement
   */
  if (loading) {
    return <p>Chargement du dashboard...</p>;
  }

  /**
   * Nombre de notifications non lues
   */
  const unreadCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  /**
   * Sélection des 3 prochaines sessions
   */
  const nextSessions = sessions.slice(0, 3);

  return (
    <div>
      {/* En-tête du dashboard */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Bonjour {user?.firstname}</h1>

        <p className="mt-2 text-slate-600">
          Voici un aperçu de ton activité sur SkillBridge.
        </p>
      </div>

      {/* Cartes statistiques principales */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Nombre de groupes */}
        <Link
          to="/groups"
          className="rounded-2xl border bg-white p-4 shadow-sm transition hover:-translate-y-1 sm:p-5"
        >
          <Users className="mb-3 h-6 w-6 text-blue-600" />

          <p className="text-sm text-slate-500">Mes groupes</p>

          <p className="text-2xl font-bold">{groups.length}</p>
        </Link>

        {/* Nombre de sessions */}
        <Link
          to="/sessions"
          className="rounded-2xl border bg-white p-4 shadow-sm transition hover:-translate-y-1 sm:p-5"
        >
          <Calendar className="mb-3 h-6 w-6 text-blue-600" />

          <p className="text-sm text-slate-500">Sessions</p>

          <p className="text-2xl font-bold">{sessions.length}</p>
        </Link>

        {/* Nombre de compétences */}
        <Link
          to="/groups"
          className="rounded-2xl border bg-white p-4 shadow-sm transition hover:-translate-y-1 sm:p-5"
        >
          <MessageCircle className="mb-3 h-6 w-6 text-blue-600" />

          <p className="text-sm text-slate-500">Compétences</p>

          <p className="text-2xl font-bold">{skills.length}</p>
        </Link>

        {/* Nombre de notifications non lues */}
        <Link
          to="/notifications"
          className="rounded-2xl border bg-white p-4 shadow-sm transition hover:-translate-y-1 sm:p-5"
        >
          <Bell className="mb-3 h-6 w-6 text-blue-600" />

          <p className="text-sm text-slate-500">Non lues</p>

          <p className="text-2xl font-bold">{unreadCount}</p>
        </Link>
      </div>

      {/* Zone principale du dashboard */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Section des prochaines sessions */}
        <section className="rounded-2xl border bg-white p-4 shadow-sm sm:p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold">Prochaines sessions</h2>

          {/* Cas où aucune session n'existe */}
          {nextSessions.length === 0 ? (
            <p className="mt-4 text-sm text-slate-600">
              Aucune session à venir.
            </p>
          ) : (
            // Liste des prochaines sessions
            <div className="mt-5 space-y-3">
              {nextSessions.map((session) => (
                <div key={session.id} className="rounded-lg border p-4">
                  <p className="font-medium">{session.title}</p>

                  <p className="mt-1 text-sm text-slate-500">
                    {session.group.name} ·{" "}
                    {new Date(session.startDate).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Lien vers toutes les sessions */}
          <Link
            to="/sessions"
            className="mt-5 inline-block text-sm font-medium text-blue-600"
          >
            Voir toutes mes sessions
          </Link>
        </section>

        {/* Carte profil utilisateur */}
        <section className="rounded-2xl border bg-white p-4 shadow-sm sm:p-6">
          <h2 className="text-xl font-semibold">Mon profil</h2>

          <div className="mt-4 space-y-2 text-sm text-slate-600">
            <p>
              <strong>Niveau :</strong> {profile?.level || "Non renseigné"}
            </p>

            <p>
              <strong>Ville :</strong> {profile?.location || "Non renseignée"}
            </p>

            <p>
              <strong>Disponibilités :</strong>{" "}
              {profile?.availability || "Non renseignées"}
            </p>
          </div>

          {/* Lien vers l'édition du profil */}
          <Link
            to="/profile"
            className="mt-5 inline-block text-sm font-medium text-blue-600"
          >
            Compléter mon profil
          </Link>
        </section>
      </div>

      {/* Section notifications récentes */}
      <section className="mt-8 rounded-2xl border bg-white p-4 shadow-sm sm:p-6">
        <h2 className="text-xl font-semibold">Notifications récentes</h2>

        {/* Cas où aucune notification n'existe */}
        {notifications.length === 0 ? (
          <p className="mt-4 text-sm text-slate-600">Aucune notification.</p>
        ) : (
          // Affichage des 3 dernières notifications
          <div className="mt-5 space-y-3">
            {notifications.slice(0, 3).map((notification) => (
              <div key={notification._id} className="rounded-lg border p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-medium">{notification.title}</p>

                  {/* Badge notification non lue */}
                  {!notification.isRead && (
                    <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">
                      Nouveau
                    </span>
                  )}
                </div>

                <p className="mt-1 text-sm text-slate-600">
                  {notification.content}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Lien vers toutes les notifications */}
        <Link
          to="/notifications"
          className="mt-5 inline-block text-sm font-medium text-blue-600"
        >
          Voir toutes les notifications
        </Link>
      </section>
    </div>
  );
}
