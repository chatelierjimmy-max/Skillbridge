import { useEffect, useState } from "react";
import { Search, MapPin, UserRound } from "lucide-react";

import { searchService } from "../../services/search.service";
import { skillService } from "../../services/skill.service";

import type { LearnerResult, SearchFilters } from "../../types/search.type";
import type { Skill } from "../../types/skill.type";
import type { Level } from "../../types/profile.type";

const levelLabel: Record<Level, string> = {
  BEGINNER: "Débutant",
  INTERMEDIATE: "Intermédiaire",
  ADVANCED: "Avancé",
};

export default function SearchPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({
    skill: "",
    level: "",
    city: "",
  });

  const [results, setResults] = useState<LearnerResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const fetchSkills = async () => {
      const data = await skillService.getAllSkills();
      setSkills(data);
    };

    fetchSkills();
  }, []);

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);
    setSearched(true);

    try {
      const data = await searchService.searchLearners(filters);
      setResults(data);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = async () => {
    const emptyFilters: SearchFilters = {
      skill: "",
      level: "",
      city: "",
    };

    setFilters(emptyFilters);
    setSearched(false);
    setResults([]);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Rechercher des apprenants</h1>

        <p className="mt-2 text-slate-600">
          Trouve des partenaires selon leurs compétences, leur niveau et leur
          ville.
        </p>
      </div>

      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <form
          onSubmit={handleSearch}
          className="grid gap-4 md:grid-cols-[1fr_1fr_1fr_auto]"
        >
          <div>
            <label className="mb-1 block text-sm font-medium">Compétence</label>

            <select
              value={filters.skill}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  skill: e.target.value,
                })
              }
              className="w-full rounded-lg border px-4 py-3"
            >
              <option value="">Toutes</option>

              {skills.map((skill) => (
                <option key={skill.id} value={skill.name}>
                  {skill.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Niveau</label>

            <select
              value={filters.level}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  level: e.target.value as Level | "",
                })
              }
              className="w-full rounded-lg border px-4 py-3"
            >
              <option value="">Tous</option>
              <option value="BEGINNER">Débutant</option>
              <option value="INTERMEDIATE">Intermédiaire</option>
              <option value="ADVANCED">Avancé</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Ville</label>

            <input
              value={filters.city}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  city: e.target.value,
                })
              }
              placeholder="Paris, Lyon..."
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>

          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white"
            >
              <Search className="h-4 w-4" />
              Rechercher
            </button>
          </div>
        </form>

        <button
          type="button"
          onClick={resetFilters}
          className="mt-4 text-sm font-medium text-slate-600"
        >
          Réinitialiser les filtres
        </button>
      </section>

      <section className="mt-8">
        {loading && <p className="text-slate-600">Recherche en cours...</p>}

        {!loading && searched && results.length === 0 && (
          <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
            <p className="font-medium">Aucun apprenant trouvé.</p>
            <p className="mt-2 text-sm text-slate-600">
              Essaie de modifier tes filtres.
            </p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {results.map((learner) => (
              <article
                key={learner.id}
                className="rounded-2xl border bg-white p-6 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                    <UserRound className="h-6 w-6" />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold">
                      {learner.firstname} {learner.lastname}
                    </h2>

                    <div className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                      <MapPin className="h-4 w-4" />
                      {learner.profile?.location || "Ville non renseignée"}
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <p>
                    <strong>Niveau :</strong>{" "}
                    {learner.profile?.level
                      ? levelLabel[learner.profile.level]
                      : "Non renseigné"}
                  </p>

                  <p>
                    <strong>Disponibilités :</strong>{" "}
                    {learner.profile?.availability || "Non renseignées"}
                  </p>

                  <p>
                    <strong>Bio :</strong>{" "}
                    {learner.profile?.bio || "Aucune bio"}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {learner.skills.map((skill) => (
                    <span
                      key={skill.id}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                    >
                      {skill.name} · {levelLabel[skill.level]}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
