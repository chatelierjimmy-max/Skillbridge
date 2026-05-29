import { useEffect, useState } from "react";
import { Calendar, MessageCircle, Users, Bell } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { profileService } from "../../services/profile.service";
import { skillService } from "../../services/skill.service";
import type { Profile } from "../../types/profile.type";
import type { UserSkill } from "../../types/skill.type";
import { levelLabel } from "../../utils/levelLabel";

export default function DashboardPage() {
  const { user } = useAuth();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [profileData, skillsData] = await Promise.all([
          profileService.getMyProfile(),
          skillService.getMySkills(),
        ]);

        setProfile(profileData);
        setSkills(skillsData);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <p>Chargement du dashboard...</p>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Bonjour {user?.firstname}</h1>

        <p className="mt-2 text-slate-600">
          Bienvenue sur ton espace SkillBridge.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <Users className="mb-3 h-6 w-6 text-blue-600" />
          <p className="text-sm text-slate-500">Groupes</p>
          <p className="text-2xl font-bold">—</p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <Calendar className="mb-3 h-6 w-6 text-blue-600" />
          <p className="text-sm text-slate-500">Sessions</p>
          <p className="text-2xl font-bold">—</p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <MessageCircle className="mb-3 h-6 w-6 text-blue-600" />
          <p className="text-sm text-slate-500">Messages</p>
          <p className="text-2xl font-bold">—</p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <Bell className="mb-3 h-6 w-6 text-blue-600" />
          <p className="text-sm text-slate-500">Notifications</p>
          <p className="text-2xl font-bold">—</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Mon profil</h2>

          <div className="mt-4 space-y-2 text-sm text-slate-600">
            <p>
              <strong>Niveau :</strong>{" "}
              {profile?.level ? levelLabel[profile.level] : "Non renseigné"}
            </p>
            <p>
              <strong>Ville :</strong> {profile?.location || "Non renseignée"}
            </p>
            <p>
              <strong>Disponibilités :</strong>{" "}
              {profile?.availability || "Non renseignées"}
            </p>
            <p>
              <strong>Bio :</strong> {profile?.bio || "Aucune bio"}
            </p>
          </div>
        </section>

        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Mes compétences</h2>

          {skills.length === 0 ? (
            <p className="mt-4 text-sm text-slate-600">
              Aucune compétence ajoutée.
            </p>
          ) : (
            <div className="mt-4 flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill.id}
                  className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
                >
                  {skill.name} · {levelLabel[skill.level]}
                </span>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
