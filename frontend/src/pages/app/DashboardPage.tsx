import { useEffect, useState } from "react";
import { Calendar, MessageCircle, Users, Bell } from "lucide-react";
import { Link } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

import { profileService } from "../../services/profile.service";
import { skillService } from "../../services/skill.service";
import { sessionService } from "../../services/session.service";
import { notificationService } from "../../services/notification.service";
import { groupService } from "../../services/group.service";

import type { Profile } from "../../types/profile.type";
import type { UserSkill } from "../../types/skill.type";
import type { MySession } from "../../types/session.type";
import type { AppNotification } from "../../types/notification.type";
import type { MyGroup } from "../../types/group.type";

export default function DashboardPage() {
  const { user } = useAuth();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [sessions, setSessions] = useState<MySession[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [groups, setGroups] = useState<MyGroup[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
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

        setProfile(profileData);
        setSkills(skillsData);
        setSessions(sessionsData);
        setNotifications(notificationsData);
        setGroups(groupsData);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <p>Chargement du dashboard...</p>;
  }

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  const nextSessions = sessions.slice(0, 3);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Bonjour {user?.firstname}</h1>

        <p className="mt-2 text-slate-600">
          Voici un aperçu de ton activité sur SkillBridge.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Link
          to="/groups"
          className="rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-1"
        >
          <Users className="mb-3 h-6 w-6 text-blue-600" />
          <p className="text-sm text-slate-500">Mes groupes</p>
          <p className="text-2xl font-bold">{groups.length}</p>
        </Link>

        <Link
          to="/sessions"
          className="rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-1"
        >
          <Calendar className="mb-3 h-6 w-6 text-blue-600" />
          <p className="text-sm text-slate-500">Sessions</p>
          <p className="text-2xl font-bold">{sessions.length}</p>
        </Link>

        <Link
          to="/groups"
          className="rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-1"
        >
          <MessageCircle className="mb-3 h-6 w-6 text-blue-600" />
          <p className="text-sm text-slate-500">Compétences</p>
          <p className="text-2xl font-bold">{skills.length}</p>
        </Link>

        <Link
          to="/notifications"
          className="rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-1"
        >
          <Bell className="mb-3 h-6 w-6 text-blue-600" />
          <p className="text-sm text-slate-500">Non lues</p>
          <p className="text-2xl font-bold">{unreadCount}</p>
        </Link>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-xl font-semibold">Prochaines sessions</h2>

          {nextSessions.length === 0 ? (
            <p className="mt-4 text-sm text-slate-600">
              Aucune session à venir.
            </p>
          ) : (
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

          <Link
            to="/sessions"
            className="mt-5 inline-block text-sm font-medium text-blue-600"
          >
            Voir toutes mes sessions
          </Link>
        </section>

        <section className="rounded-2xl border bg-white p-6 shadow-sm">
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

          <Link
            to="/profile"
            className="mt-5 inline-block text-sm font-medium text-blue-600"
          >
            Compléter mon profil
          </Link>
        </section>
      </div>

      <section className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Notifications récentes</h2>

        {notifications.length === 0 ? (
          <p className="mt-4 text-sm text-slate-600">Aucune notification.</p>
        ) : (
          <div className="mt-5 space-y-3">
            {notifications.slice(0, 3).map((notification) => (
              <div key={notification._id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{notification.title}</p>

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
