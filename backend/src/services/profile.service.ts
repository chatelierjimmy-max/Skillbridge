// Import de l'enum Level généré par Prisma.
// Il représente les niveaux de compétence disponibles :
// - BEGINNER
// - INTERMEDIATE
// - ADVANCED
import { Level } from "@prisma/client";

// Repository du profil.
// Responsable des opérations de lecture et de mise à jour
// des profils utilisateurs dans la base de données.
import { profileRepository } from "../repositories/profile.repository";

// Classe d'erreur personnalisée.
// Permet de générer des erreurs HTTP métier.
import { AppError } from "../utils/AppError";

/**
 * Données pouvant être modifiées
 * sur le profil utilisateur.
 *
 * Tous les champs sont optionnels
 * afin de permettre des mises à jour partielles.
 */
interface UpdateProfileInput {
  bio?: string;
  level?: Level;
  availability?: string;
  location?: string;
}

/**
 * Service métier des profils utilisateurs.
 *
 * Responsable de :
 * - récupérer le profil de l'utilisateur connecté
 * - mettre à jour le profil utilisateur
 */
export const profileService = {
  /**
   * Retourne le profil de l'utilisateur connecté.
   *
   * @param userId Identifiant de l'utilisateur
   */
  async getMyProfile(userId: number) {
    // Recherche du profil associé à l'utilisateur.
    const profile = await profileRepository.findByUserId(userId);

    // Aucun profil trouvé.
    if (!profile) {
      throw new AppError("Profil introuvable", 404);
    }

    return profile;
  },

  /**
   * Met à jour le profil de l'utilisateur connecté.
   *
   * Les champs non fournis restent inchangés.
   *
   * @param userId Identifiant de l'utilisateur
   * @param data Nouvelles informations du profil
   */
  async updateMyProfile(userId: number, data: UpdateProfileInput) {
    // Le repository utilise un upsert :
    //
    // - update si le profil existe
    // - create sinon
    //
    // Cela garantit qu'un profil est toujours disponible
    // pour l'utilisateur.
    return profileRepository.update(userId, data);
  },
};
