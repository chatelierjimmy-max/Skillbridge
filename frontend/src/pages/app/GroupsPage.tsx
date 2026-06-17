// Importation des hooks React
// useState : gestion des états locaux
// useEffect : exécution d'une action au montage du composant
import { useEffect, useState } from "react";

// Link permet de naviguer vers une autre page sans rechargement
import { Link } from "react-router-dom";

// Importation des icônes utilisées dans l'interface
import { Plus, Users } from "lucide-react";

// Services API pour les groupes et les compétences
import { groupService } from "../../services/group.service";
import { skillService } from "../../services/skill.service";

// Types TypeScript utilisés dans cette page
import type { GroupListItem } from "../../types/group.type";
import type { Skill } from "../../types/skill.type";
import type { Level } from "../../types/profile.type";

// Objet permettant de traduire les niveaux techniques en libellés lisibles
import { levelLabel } from "../../utils/levelLabel";

// Utilitaire permettant d'afficher une erreur API compréhensible
import { getApiErrorMessage } from "../../utils/apiError";

// Page principale des groupes
export default function GroupsPage() {
  // Liste des groupes disponibles
  const [groups, setGroups] = useState<GroupListItem[]>([]);

  // Liste des compétences disponibles pour créer un groupe
  const [skills, setSkills] = useState<Skill[]>([]);

  // Indique si les données sont en cours de chargement
  const [loading, setLoading] = useState(true);

  // Nom du groupe en cours de création
  const [name, setName] = useState("");

  // Description du groupe en cours de création
  const [description, setDescription] = useState("");

  // Niveau du groupe sélectionné
  // Valeur par défaut : BEGINNER
  const [level, setLevel] = useState<Level>("BEGINNER");

  // Identifiant de la compétence sélectionnée
  // Stocké en string car la valeur d'un <select> HTML est toujours une chaîne
  const [skillId, setSkillId] = useState("");

  // Message d'erreur affiché dans l'interface
  const [error, setError] = useState("");

  /**
   * Récupère les groupes disponibles et les compétences.
   *
   * Promise.all permet d'exécuter les deux appels API en parallèle :
   * - récupération des groupes
   * - récupération des compétences
   */
  const fetchData = async () => {
    try {
      const [groupsData, skillsData] = await Promise.all([
        groupService.getGroups(),
        skillService.getAllSkills(),
      ]);

      // Mise à jour des états avec les données reçues
      setGroups(groupsData);
      setSkills(skillsData);
    } finally {
      // Fin du chargement, même en cas d'erreur
      setLoading(false);
    }
  };

  /**
   * Chargement initial des données lors de l'ouverture de la page.
   */
  useEffect(() => {
    fetchData();
  }, []);

  /**
   * Création d'un nouveau groupe.
   *
   * @param event Événement de soumission du formulaire
   */
  const handleCreateGroup = async (event: React.FormEvent) => {
    // Empêche le rechargement de la page
    event.preventDefault();

    try {
      // Réinitialise l'erreur précédente
      setError("");

      // Vérifie qu'une compétence a bien été sélectionnée
      if (!skillId) {
        setError("Veuillez sélectionner une compétence.");
        return;
      }

      // Appel API pour créer le groupe
      await groupService.createGroup({
        name,
        description,
        level,

        // Conversion de l'id de compétence en nombre
        skillId: Number(skillId),
      });

      // Réinitialisation du formulaire après création
      setName("");
      setDescription("");
      setLevel("BEGINNER");
      setSkillId("");

      // Recharge la liste des groupes pour afficher le nouveau groupe
      await fetchData();
    } catch (error) {
      setError(
        getApiErrorMessage(error, "Erreur lors de la création du groupe"),
      );
    }
  };

  /**
   * Affichage pendant le chargement initial
   */
  if (loading) {
    return <p>Chargement des groupes...</p>;
  }

  return (
    <div>
      {/* En-tête de la page */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Groupes</h1>

        <p className="mt-2 text-slate-600">
          Crée ou rejoins des groupes d’entraide.
        </p>
      </div>

      {/* Section de création d'un groupe */}
      <section className="rounded-2xl border bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-5 flex items-center gap-2">
          <Plus className="h-5 w-5 text-blue-600" />

          <h2 className="text-xl font-semibold">Créer un groupe</h2>
        </div>

        {/* Affichage de l'erreur si elle existe */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Formulaire de création */}
        <form
          onSubmit={handleCreateGroup}
          className="grid gap-4 md:grid-cols-2"
        >
          {/* Champ nom du groupe */}
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

          {/* Sélection de la compétence */}
          <div>
            <label className="mb-1 block text-sm font-medium">Compétence</label>

            <select
              value={skillId}
              onChange={(e) => setSkillId(e.target.value)}
              className="w-full rounded-lg border px-4 py-3"
              required
            >
              <option value="">Sélectionner</option>

              {/* Génération dynamique des options depuis les compétences API */}
              {skills.map((skill) => (
                <option key={skill.id} value={skill.id}>
                  {skill.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sélection du niveau */}
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

          {/* Description du groupe */}
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

          {/* Bouton de création */}
          <div className="md:col-span-2">
            <button className="w-full rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition-colors duration-200 hover:bg-blue-700 sm:w-auto">
              Créer le groupe
            </button>
          </div>
        </form>
      </section>

      {/* Section des groupes disponibles */}
      <section className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">Groupes disponibles</h2>

        {groups.length === 0 ? (
          // Affichage si aucun groupe n'existe
          <div className="rounded-2xl border bg-white p-6 text-center shadow-sm sm:p-8">
            <p>Aucun groupe disponible.</p>
          </div>
        ) : (
          // Grille responsive des groupes
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {groups.map((group) => (
              <article
                key={group.id}
                className="rounded-2xl border bg-white p-4 shadow-sm sm:p-6"
              >
                {/* En-tête de la carte du groupe */}
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{group.name}</h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {group.skill.name} ·{" "}
                      {group.level ? levelLabel[group.level] : "Niveau libre"}
                    </p>
                  </div>

                  {/* Nombre de membres */}
                  <div className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
                    <Users className="h-4 w-4" />
                    {group.membersCount}
                  </div>
                </div>

                {/* Description courte du groupe */}
                <p className="line-clamp-3 text-sm text-slate-600">
                  {group.description || "Aucune description."}
                </p>

                {/* Créateur du groupe */}
                <p className="mt-4 text-xs text-slate-500">
                  Créé par {group.owner.firstname} {group.owner.lastname}
                </p>

                {/* Lien vers le détail du groupe */}
                <Link
                  to={`/groups/${group.id}`}
                  className="mt-5 inline-flex w-full justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-700 sm:w-auto"
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
