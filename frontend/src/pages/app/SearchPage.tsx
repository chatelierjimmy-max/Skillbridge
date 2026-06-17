// Importation des hooks React
// useState : gestion des états locaux
// useEffect : exécution d'une action au montage du composant
import { useEffect, useState } from "react";

// Importation des icônes utilisées dans l'interface
import { Search, MapPin, UserRound } from "lucide-react";

// Service API pour rechercher des apprenants
import { searchService } from "../../services/search.service";

// Service API pour récupérer la liste des compétences disponibles
import { skillService } from "../../services/skill.service";

// Types TypeScript utilisés pour les résultats et les filtres
import type { LearnerResult, SearchFilters } from "../../types/search.type";
import type { Skill } from "../../types/skill.type";
import type { Level } from "../../types/profile.type";

// Objet de traduction des niveaux techniques
const levelLabel: Record<Level, string> = {
  BEGINNER: "Débutant",
  INTERMEDIATE: "Intermédiaire",
  ADVANCED: "Avancé",
};

// Page de recherche d'apprenants
export default function SearchPage() {
  // Liste des compétences disponibles dans le filtre
  const [skills, setSkills] = useState<Skill[]>([]);

  // Filtres actuellement sélectionnés
  const [filters, setFilters] = useState<SearchFilters>({
    skill: "",
    level: "",
    city: "",
  });

  // Résultats retournés par la recherche
  const [results, setResults] = useState<LearnerResult[]>([]);

  // Indique si une recherche est en cours
  const [loading, setLoading] = useState(false);

  // Indique si l'utilisateur a déjà lancé une recherche
  // Permet d'éviter d'afficher "Aucun apprenant trouvé" avant la première recherche
  const [searched, setSearched] = useState(false);

  /**
   * Charge la liste des compétences au montage de la page.
   */
  useEffect(() => {
    const fetchSkills = async () => {
      // Récupération des compétences depuis l'API
      const data = await skillService.getAllSkills();

      // Stockage des compétences dans l'état local
      setSkills(data);
    };

    fetchSkills();
  }, []);

  /**
   * Lance une recherche d'apprenants avec les filtres actuels.
   *
   * @param event Événement de soumission du formulaire
   */
  const handleSearch = async (event: React.FormEvent) => {
    // Empêche le rechargement de la page
    event.preventDefault();

    // Active l'état de chargement
    setLoading(true);

    // Indique qu'une recherche a déjà été effectuée
    setSearched(true);

    try {
      // Appel API avec les filtres sélectionnés
      const data = await searchService.searchLearners(filters);

      // Mise à jour des résultats
      setResults(data);
    } finally {
      // Désactive le chargement, même en cas d'erreur
      setLoading(false);
    }
  };

  /**
   * Réinitialise tous les filtres et vide les résultats.
   */
  const resetFilters = async () => {
    const emptyFilters: SearchFilters = {
      skill: "",
      level: "",
      city: "",
    };

    // Réinitialise les filtres
    setFilters(emptyFilters);

    // Considère qu'aucune recherche n'est active
    setSearched(false);

    // Vide les résultats affichés
    setResults([]);
  };

  return (
    <div>
      {/* En-tête de la page */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Rechercher des apprenants</h1>

        <p className="mt-2 text-slate-600">
          Trouve des partenaires selon leurs compétences, leur niveau et leur
          ville.
        </p>
      </div>

      {/* Bloc contenant le formulaire de recherche */}
      <section className="rounded-2xl border bg-white p-4 shadow-sm sm:p-6">
        <form
          onSubmit={handleSearch}
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_auto]"
        >
          {/* Filtre par compétence */}
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

          {/* Filtre par niveau */}
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

          {/* Filtre par ville */}
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

          {/* Bouton de recherche */}
          <div className="flex items-end gap-2 md:col-span-2 xl:col-span-1">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition-colors duration-200 hover:bg-blue-700 xl:w-auto"
            >
              <Search className="h-4 w-4" />
              Rechercher
            </button>
          </div>
        </form>

        {/* Bouton permettant de vider les filtres */}
        <button
          type="button"
          onClick={resetFilters}
          className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-700 sm:w-auto"
        >
          Réinitialiser les filtres
        </button>
      </section>

      {/* Zone d'affichage des résultats */}
      <section className="mt-8">
        {/* Message pendant la recherche */}
        {loading && <p className="text-slate-600">Recherche en cours...</p>}

        {/* Aucun résultat après une recherche */}
        {!loading && searched && results.length === 0 && (
          <div className="rounded-2xl border bg-white p-6 text-center shadow-sm sm:p-8">
            <p className="font-medium">Aucun apprenant trouvé.</p>

            <p className="mt-2 text-sm text-slate-600">
              Essaie de modifier tes filtres.
            </p>
          </div>
        )}

        {/* Résultats trouvés */}
        {!loading && results.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {results.map((learner) => (
              <article
                key={learner.id}
                className="rounded-2xl border bg-white p-4 shadow-sm sm:p-6"
              >
                {/* En-tête de la carte apprenant */}
                <div className="flex items-start gap-3 sm:gap-4">
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

                {/* Informations du profil */}
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

                {/* Liste des compétences de l'apprenant */}
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
