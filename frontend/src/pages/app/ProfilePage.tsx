// Importation des hooks React
// useState : permet de gérer les états locaux du composant
// useEffect : permet d'exécuter une action au montage du composant
// useCallback : permet de mémoriser une fonction entre les rendus
import { useCallback, useEffect, useState } from "react";

// Service API pour récupérer et modifier le profil utilisateur
import { profileService } from "../../services/profile.service";

// Service API pour récupérer, ajouter et supprimer des compétences
import { skillService } from "../../services/skill.service";

// Types TypeScript liés au profil utilisateur
import type { Level, Profile } from "../../types/profile.type";

// Types TypeScript liés aux compétences
import type { Skill, UserSkill } from "../../types/skill.type";

// Objet permettant d'afficher un libellé lisible pour chaque niveau
import { levelLabel } from "../../utils/levelLabel";

// Page de gestion du profil utilisateur
export default function ProfilePage() {
  // Profil de l'utilisateur connecté
  // Partial<Profile> signifie que certaines propriétés peuvent être absentes
  const [profile, setProfile] = useState<Partial<Profile>>({});

  // Liste complète des compétences disponibles dans l'application
  const [allSkills, setAllSkills] = useState<Skill[]>([]);

  // Liste des compétences déjà ajoutées par l'utilisateur
  const [mySkills, setMySkills] = useState<UserSkill[]>([]);

  // Identifiant de la compétence sélectionnée dans le formulaire d'ajout
  const [selectedSkillId, setSelectedSkillId] = useState("");

  // Niveau sélectionné pour la compétence à ajouter
  const [selectedLevel, setSelectedLevel] = useState<Level>("BEGINNER");

  // Message de succès affiché après une action
  const [message, setMessage] = useState("");

  // Message d'erreur affiché en cas de problème
  const [error, setError] = useState("");

  // Indique si une compétence est en cours d'ajout
  // Sert à désactiver le bouton et éviter les doubles clics
  const [isAddingSkill, setIsAddingSkill] = useState(false);

  /**
   * Récupère les données nécessaires à la page profil.
   *
   * Promise.all permet de lancer les requêtes en parallèle :
   * - profil utilisateur
   * - liste complète des compétences
   * - compétences de l'utilisateur
   */
  const fetchData = useCallback(async () => {
    try {
      // Réinitialise l'erreur précédente
      setError("");

      const [profileData, skillsData, mySkillsData] = await Promise.all([
        profileService.getMyProfile(),
        skillService.getAllSkills(),
        skillService.getMySkills(),
      ]);

      // Mise à jour des états avec les données reçues
      setProfile(profileData);
      setAllSkills(skillsData);
      setMySkills(mySkillsData);
    } catch {
      // Message générique si une des requêtes échoue
      setError("Impossible de charger les données du profil.");
    }
  }, []);

  /**
   * Chargement initial du profil et des compétences.
   */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchData();
  }, [fetchData]);

  /**
   * Enregistre les modifications du profil.
   *
   * @param event Événement de soumission du formulaire
   */
  const handleProfileSubmit = async (event: React.FormEvent) => {
    // Empêche le rechargement de la page
    event.preventDefault();

    // Envoie les données du profil modifié à l'API
    await profileService.updateMyProfile(profile);

    // Affiche un message de confirmation
    setMessage("Profil mis à jour");
  };

  /**
   * Ajoute une compétence au profil utilisateur.
   *
   * @param event Événement de soumission du formulaire
   */
  const handleAddSkill = async (event: React.FormEvent) => {
    // Empêche le rechargement de la page
    event.preventDefault();

    // Vérifie qu'une compétence a bien été sélectionnée
    if (!selectedSkillId) {
      setError("Sélectionne une compétence avant de cliquer sur Ajouter.");
      return;
    }

    try {
      // Réinitialise les messages précédents
      setError("");
      setMessage("");

      // Active l'état de chargement du bouton
      setIsAddingSkill(true);

      // Ajoute la compétence avec le niveau choisi
      await skillService.addMySkill(Number(selectedSkillId), selectedLevel);

      // Réinitialise le champ compétence après ajout
      setSelectedSkillId("");

      // Affiche un message de confirmation
      setMessage("Compétence ajoutée");

      // Recharge les compétences pour afficher la nouvelle compétence
      await fetchData();
    } catch {
      setError("Impossible d'ajouter cette compétence.");
    } finally {
      // Désactive l'état de chargement du bouton
      setIsAddingSkill(false);
    }
  };

  /**
   * Supprime une compétence du profil utilisateur.
   *
   * @param skillId Identifiant de la compétence à supprimer
   */
  const handleRemoveSkill = async (skillId: number) => {
    // Suppression côté API
    await skillService.removeMySkill(skillId);

    // Rechargement des compétences après suppression
    await fetchData();
  };

  return (
    <div>
      {/* Titre principal de la page */}
      <h1 className="text-3xl font-bold">Mon profil</h1>

      {/* Message de succès */}
      {message && (
        <div className="mt-4 rounded-lg bg-green-100 p-3 text-sm text-green-700">
          {message}
        </div>
      )}

      {/* Message d'erreur */}
      {error && (
        <div className="mt-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Layout principal en deux colonnes sur grand écran */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Section des informations personnelles */}
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Informations personnelles</h2>

          <form onSubmit={handleProfileSubmit} className="mt-6 space-y-5">
            {/* Champ biographie */}
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

            {/* Sélection du niveau général de l'utilisateur */}
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

            {/* Champ disponibilités */}
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

            {/* Champ ville */}
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

            {/* Bouton d'enregistrement du profil */}
            <button className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition-colors duration-200 hover:bg-blue-700">
              Enregistrer le profil
            </button>
          </form>
        </section>

        {/* Section des compétences */}
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Compétences</h2>

          {/* Formulaire d'ajout de compétence */}
          <form
            onSubmit={handleAddSkill}
            className="mt-6 grid gap-3 md:grid-cols-[1fr_1fr_auto]"
          >
            {/* Sélection de la compétence */}
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

            {/* Sélection du niveau associé à la compétence */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value as Level)}
              className="rounded-lg border px-4 py-3"
            >
              <option value="BEGINNER">Débutant</option>
              <option value="INTERMEDIATE">Intermédiaire</option>
              <option value="ADVANCED">Avancé</option>
            </select>

            {/* Bouton d'ajout */}
            <button
              type="submit"
              disabled={!selectedSkillId || isAddingSkill}
              className="rounded-lg bg-blue-600 px-5 py-3 text-white transition-colors duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isAddingSkill ? "Ajout..." : "Ajouter"}
            </button>
          </form>

          {/* Liste des compétences de l'utilisateur */}
          <div className="mt-6 space-y-3">
            {mySkills.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  {/* Nom de la compétence */}
                  <p className="font-medium">{skill.name}</p>

                  {/* Catégorie et niveau */}
                  <p className="text-sm text-slate-500">
                    {skill.category} · {levelLabel[skill.level]}
                  </p>
                </div>

                {/* Bouton de suppression */}
                <button
                  onClick={() => handleRemoveSkill(skill.id)}
                  className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-red-700"
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
