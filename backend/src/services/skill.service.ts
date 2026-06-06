// Import de l'enum Level générée par Prisma.
// Représente les niveaux de maîtrise possibles d'une compétence.
import { Level } from "@prisma/client";

// Repository des compétences.
// Responsable des opérations d'accès aux données liées aux compétences.
import { skillRepository } from "../repositories/skill.repository";

// Classe d'erreur personnalisée.
// Permet de lever des erreurs HTTP métier contrôlées.
import { AppError } from "../utils/AppError";

/**
 * Service métier des compétences.
 *
 * Responsable de :
 * - récupérer la liste des compétences disponibles
 * - récupérer les compétences de l'utilisateur connecté
 * - ajouter une compétence à un profil
 * - supprimer une compétence d'un profil
 */
export const skillService = {
  /**
   * Retourne toutes les compétences disponibles.
   *
   * Les compétences sont généralement utilisées
   * lors de :
   * - la création d'un groupe
   * - la recherche d'apprenants
   * - la gestion du profil utilisateur
   */
  async getAllSkills() {
    return skillRepository.findAll();
  },

  /**
   * Retourne les compétences de l'utilisateur connecté.
   *
   * Transforme la structure UserSkill → Skill
   * en une réponse plus simple pour le frontend.
   *
   * @param userId Identifiant de l'utilisateur
   */
  async getMySkills(userId: number) {
    const userSkills = await skillRepository.findUserSkills(userId);

    return userSkills.map((userSkill) => ({
      // Identifiant de la compétence.
      id: userSkill.skill.id,

      // Nom de la compétence.
      name: userSkill.skill.name,

      // Catégorie associée.
      category: userSkill.skill.category,

      // Niveau de maîtrise de l'utilisateur.
      level: userSkill.level,
    }));
  },

  /**
   * Ajoute une compétence au profil utilisateur.
   *
   * Si la relation existe déjà,
   * le niveau est automatiquement mis à jour
   * grâce à l'upsert utilisé dans le repository.
   *
   * @param userId Identifiant utilisateur
   * @param skillId Identifiant de la compétence
   * @param level Niveau de maîtrise
   */
  async addMySkill(userId: number, skillId: number, level: Level) {
    // Vérifie que la compétence existe.
    const skill = await skillRepository.findById(skillId);

    if (!skill) {
      throw new AppError("Compétence introuvable", 404);
    }

    // Création ou mise à jour de la relation
    // utilisateur ↔ compétence.
    return skillRepository.addUserSkill(userId, skillId, level);
  },

  /**
   * Supprime une compétence du profil utilisateur.
   *
   * @param userId Identifiant utilisateur
   * @param skillId Identifiant de la compétence
   */
  async removeMySkill(userId: number, skillId: number) {
    // Vérifie d'abord que la compétence existe.
    const skill = await skillRepository.findById(skillId);

    if (!skill) {
      throw new AppError("Compétence introuvable", 404);
    }

    try {
      // Suppression de la relation
      // utilisateur ↔ compétence.
      await skillRepository.removeUserSkill(userId, skillId);
    } catch {
      /**
       * Cas où la relation n'existe pas.
       *
       * Prisma déclenche généralement une exception
       * lorsqu'une suppression cible un enregistrement absent.
       */
      throw new AppError(
        "Cette compétence n'est pas associée à votre profil",
        404,
      );
    }
  },
};
