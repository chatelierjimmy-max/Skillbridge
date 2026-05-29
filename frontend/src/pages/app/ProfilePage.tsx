import { useEffect, useState } from "react";
import { profileService } from "../../services/profile.service";
import { skillService } from "../../services/skill.service";
import type { Level, Profile } from "../../types/profile.type";
import type { Skill, UserSkill } from "../../types/skill.type";
import { levelLabel } from "../../utils/levelLabel";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [mySkills, setMySkills] = useState<UserSkill[]>([]);
  const [selectedSkillId, setSelectedSkillId] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<Level>("BEGINNER");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isAddingSkill, setIsAddingSkill] = useState(false);

  const fetchData = async () => {
    try {
      setError("");

      const [profileData, skillsData, mySkillsData] = await Promise.all([
        profileService.getMyProfile(),
        skillService.getAllSkills(),
        skillService.getMySkills(),
      ]);

      setProfile(profileData);
      setAllSkills(skillsData);
      setMySkills(mySkillsData);
    } catch {
      setError("Impossible de charger les données du profil.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleProfileSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    await profileService.updateMyProfile(profile);

    setMessage("Profil mis à jour");
  };

  const handleAddSkill = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedSkillId) {
      setError("Sélectionne une compétence avant de cliquer sur Ajouter.");
      return;
    }

    try {
      setError("");
      setMessage("");
      setIsAddingSkill(true);

      await skillService.addMySkill(Number(selectedSkillId), selectedLevel);

      setSelectedSkillId("");
      setMessage("Compétence ajoutée");
      await fetchData();
    } catch {
      setError("Impossible d'ajouter cette compétence.");
    } finally {
      setIsAddingSkill(false);
    }
  };

  const handleRemoveSkill = async (skillId: number) => {
    await skillService.removeMySkill(skillId);
    await fetchData();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">Mon profil</h1>

      {message && (
        <div className="mt-4 rounded-lg bg-green-100 p-3 text-sm text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Informations personnelles</h2>

          <form onSubmit={handleProfileSubmit} className="mt-6 space-y-5">
            <div>
              <label className="mb-1 block text-sm font-medium">Bio</label>

              <textarea
                value={profile.bio || ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    bio: e.target.value,
                  })
                }
                className="min-h-28 w-full rounded-lg border px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Niveau</label>

              <select
                value={profile.level || ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    level: e.target.value as Level,
                  })
                }
                className="w-full rounded-lg border px-4 py-3"
              >
                <option value="">Sélectionner</option>
                <option value="BEGINNER">Débutant</option>
                <option value="INTERMEDIATE">Intermédiaire</option>
                <option value="ADVANCED">Avancé</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Disponibilités
              </label>

              <input
                value={profile.availability || ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    availability: e.target.value,
                  })
                }
                className="w-full rounded-lg border px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Ville</label>

              <input
                value={profile.location || ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    location: e.target.value,
                  })
                }
                className="w-full rounded-lg border px-4 py-3"
              />
            </div>

            <button className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white">
              Enregistrer le profil
            </button>
          </form>
        </section>

        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Compétences</h2>

          <form
            onSubmit={handleAddSkill}
            className="mt-6 grid gap-3 md:grid-cols-[1fr_1fr_auto]"
          >
            <select
              value={selectedSkillId}
              onChange={(e) => setSelectedSkillId(e.target.value)}
              className="rounded-lg border px-4 py-3"
            >
              <option value="">Compétence</option>
              {allSkills.map((skill) => (
                <option key={skill.id} value={skill.id}>
                  {skill.name}
                </option>
              ))}
            </select>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value as Level)}
              className="rounded-lg border px-4 py-3"
            >
              <option value="BEGINNER">Débutant</option>
              <option value="INTERMEDIATE">Intermédiaire</option>
              <option value="ADVANCED">Avancé</option>
            </select>

            <button
              type="submit"
              disabled={!selectedSkillId || isAddingSkill}
              className="rounded-lg bg-slate-900 px-5 py-3 text-white disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isAddingSkill ? "Ajout..." : "Ajouter"}
            </button>
          </form>

          <div className="mt-6 space-y-3">
            {mySkills.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <p className="font-medium">{skill.name}</p>
                  <p className="text-sm text-slate-500">
                    {skill.category} · {levelLabel[skill.level]}
                  </p>
                </div>

                <button
                  onClick={() => handleRemoveSkill(skill.id)}
                  className="text-sm font-medium text-red-600"
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
