import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Users } from "lucide-react";

import { groupService } from "../../services/group.service";
import { skillService } from "../../services/skill.service";

import type { GroupListItem } from "../../types/group.type";
import type { Skill } from "../../types/skill.type";
import type { Level } from "../../types/profile.type";
import { levelLabel } from "../../utils/levelLabel";

export default function GroupsPage() {
  const [groups, setGroups] = useState<GroupListItem[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState<Level>("BEGINNER");
  const [skillId, setSkillId] = useState("");

  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const [groupsData, skillsData] = await Promise.all([
        groupService.getGroups(),
        skillService.getAllSkills(),
      ]);

      setGroups(groupsData);
      setSkills(skillsData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateGroup = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setError("");

      if (!skillId) {
        setError("Veuillez sélectionner une compétence.");
        return;
      }

      await groupService.createGroup({
        name,
        description,
        level,
        skillId: Number(skillId),
      });

      setName("");
      setDescription("");
      setLevel("BEGINNER");
      setSkillId("");

      await fetchData();
    } catch (error: any) {
      setError(
        error.response?.data?.error || "Erreur lors de la création du groupe",
      );
    }
  };

  if (loading) {
    return <p>Chargement des groupes...</p>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Groupes</h1>
        <p className="mt-2 text-slate-600">
          Crée ou rejoins des groupes d’entraide.
        </p>
      </div>

      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-2">
          <Plus className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold">Créer un groupe</h2>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleCreateGroup}
          className="grid gap-4 md:grid-cols-2"
        >
          <div>
            <label className="mb-1 block text-sm font-medium">
              Nom du groupe
            </label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={3}
              className="w-full rounded-lg border px-4 py-3"
              placeholder="React débutants"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Compétence</label>

            <select
              value={skillId}
              onChange={(e) => setSkillId(e.target.value)}
              className="w-full rounded-lg border px-4 py-3"
              required
            >
              <option value="">Sélectionner</option>

              {skills.map((skill) => (
                <option key={skill.id} value={skill.id}>
                  {skill.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Niveau</label>

            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as Level)}
              className="w-full rounded-lg border px-4 py-3"
            >
              <option value="BEGINNER">Débutant</option>
              <option value="INTERMEDIATE">Intermédiaire</option>
              <option value="ADVANCED">Avancé</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-24 w-full rounded-lg border px-4 py-3"
              placeholder="Objectif du groupe..."
            />
          </div>

          <div className="md:col-span-2">
            <button className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white">
              Créer le groupe
            </button>
          </div>
        </form>
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">Groupes disponibles</h2>

        {groups.length === 0 ? (
          <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
            <p>Aucun groupe disponible.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {groups.map((group) => (
              <article
                key={group.id}
                className="rounded-2xl border bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">{group.name}</h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {group.skill.name} ·{" "}
                      {group.level ? levelLabel[group.level] : "Niveau libre"}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
                    <Users className="h-4 w-4" />
                    {group.membersCount}
                  </div>
                </div>

                <p className="line-clamp-3 text-sm text-slate-600">
                  {group.description || "Aucune description."}
                </p>

                <p className="mt-4 text-xs text-slate-500">
                  Créé par {group.owner.firstname} {group.owner.lastname}
                </p>

                <Link
                  to={`/groups/${group.id}`}
                  className="mt-5 inline-block rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
                >
                  Voir le groupe
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
