// Import de l'instance Prisma configurée pour accéder à la base de données
import { prisma } from "../config/prisma";

// Import de l'énumération UserStatus générée par Prisma
// Permet de garantir que seuls les statuts valides peuvent être utilisés
import { UserStatus } from "@prisma/client";

// Repository dédié aux opérations administrateur sur les utilisateurs.
// Le pattern Repository permet de centraliser les accès à la base de données.
export const adminRepository = {
  /**
   * Récupère la liste complète des utilisateurs.
   *
   * - Ne retourne que certains champs grâce à "select"
   *   afin d'éviter d'exposer des données inutiles ou sensibles.
   * - Inclut également certaines informations du profil associé.
   * - Trie les utilisateurs du plus récent au plus ancien
   *   selon leur date de création.
   */
  findAllUsers() {
    return prisma.user.findMany({
      select: {
        // Identifiant unique de l'utilisateur
        id: true,

        // Prénom de l'utilisateur
        firstname: true,

        // Nom de famille de l'utilisateur
        lastname: true,

        // Adresse email
        email: true,

        // Rôle (USER, ADMIN, etc.)
        role: true,

        // Statut du compte (ACTIVE, SUSPENDED, etc.)
        status: true,

        // Date de création du compte
        createdAt: true,

        // Récupération des informations liées au profil
        profile: {
          select: {
            // Niveau de l'utilisateur
            level: true,

            // Localisation géographique
            location: true,
          },
        },
      },

      // Tri décroissant : les comptes les plus récents apparaissent en premier
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  /**
   * Recherche un utilisateur à partir de son identifiant.
   *
   * @param id - Identifiant unique de l'utilisateur
   * @returns L'utilisateur trouvé ou null si aucun utilisateur ne correspond
   */
  findUserById(id: number) {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  /**
   * Met à jour le statut d'un utilisateur.
   *
   * Exemple :
   * - ACTIVE
   * - SUSPENDED
   * - PENDING
   *
   * @param id - Identifiant de l'utilisateur à modifier
   * @param status - Nouveau statut à appliquer
   * @returns Les informations principales de l'utilisateur après mise à jour
   */
  updateUserStatus(id: number, status: UserStatus) {
    return prisma.user.update({
      // Sélection de l'utilisateur à modifier
      where: { id },

      // Données à mettre à jour
      data: {
        status,
      },

      // Retourne uniquement certains champs après la mise à jour
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        role: true,
        status: true,
      },
    });
  },
};
