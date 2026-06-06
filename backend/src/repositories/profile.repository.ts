// Import de l'instance Prisma configurée.
// Elle permet d'exécuter les requêtes vers la base de données relationnelle.
import { prisma } from "../config/prisma";

// Import de l'énumération Level générée par Prisma.
// Cette enum garantit que seuls les niveaux autorisés
// peuvent être enregistrés dans le profil utilisateur.
import { Level } from "@prisma/client";

/**
 * Interface représentant les données modifiables
 * dans le profil d'un utilisateur.
 *
 * Tous les champs sont optionnels afin de permettre
 * des mises à jour partielles.
 */
interface UpdateProfileData {
  // Présentation ou description personnelle
  bio?: string;

  // Niveau de compétence de l'utilisateur
  level?: Level;

  // Disponibilités (soir, week-end, etc.)
  availability?: string;

  // Ville ou localisation de l'utilisateur
  location?: string;
}

/**
 * Repository chargé de gérer les opérations
 * liées aux profils utilisateurs.
 *
 * Il encapsule toutes les interactions avec
 * la table Profile de la base de données.
 */
export const profileRepository = {
  /**
   * Recherche le profil associé à un utilisateur.
   *
   * La relation entre User et Profile étant généralement
   * de type 1:1, la recherche s'effectue à partir
   * de l'identifiant utilisateur.
   *
   * @param userId Identifiant de l'utilisateur
   * @returns Le profil trouvé ou null s'il n'existe pas
   */
  findByUserId(userId: number) {
    return prisma.profile.findUnique({
      where: {
        userId,
      },
    });
  },

  /**
   * Crée ou met à jour un profil utilisateur.
   *
   * Utilisation de la méthode Prisma "upsert" :
   *
   * - Si un profil existe déjà pour cet utilisateur,
   *   il est mis à jour.
   *
   * - Si aucun profil n'existe,
   *   un nouveau profil est créé automatiquement.
   *
   * Cette approche évite :
   * 1. Une requête de vérification préalable
   * 2. Une logique conditionnelle complexe
   * 3. Les risques de concurrence entre requêtes
   *
   * @param userId Identifiant de l'utilisateur
   * @param data Données à créer ou modifier
   * @returns Le profil créé ou mis à jour
   */
  update(userId: number, data: UpdateProfileData) {
    return prisma.profile.upsert({
      // Critère permettant de savoir
      // si le profil existe déjà
      where: {
        userId,
      },

      // Mise à jour si le profil existe
      update: data,

      // Création si le profil n'existe pas
      create: {
        userId,

        // Copie toutes les propriétés reçues
        ...data,
      },
    });
  },
};
