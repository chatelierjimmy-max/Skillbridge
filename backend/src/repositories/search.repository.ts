// Import de l'enum UserStatus générée par Prisma.
// Elle permet de filtrer uniquement les utilisateurs actifs.
import { UserStatus } from "@prisma/client";

// Import des types Prisma.
// Level représente le niveau utilisateur.
// Prisma permet d'utiliser les types générés automatiquement.
import type { Level, Prisma } from "@prisma/client";

// Import de l'instance Prisma configurée pour accéder à la base de données.
import { prisma } from "../config/prisma";

/**
 * Interface décrivant les filtres disponibles
 * pour rechercher des apprenants.
 */
interface SearchLearnersFilters {
  // Identifiant de l'utilisateur connecté.
  // Il permet d'exclure l'utilisateur courant des résultats.
  userId: number;

  // Nom ou partie du nom d'une compétence recherchée
  skill?: string;

  // Niveau recherché
  level?: Level;

  // Ville ou localisation recherchée
  city?: string;

  // Numéro de page pour la pagination
  page?: number;

  // Nombre de résultats par page
  limit?: number;
}

/**
 * Sélection Prisma réutilisable.
 *
 * Elle définit précisément les champs retournés
 * lors d'une recherche d'apprenants.
 *
 * L'utilisation de "select" permet :
 * - d'éviter de retourner des données sensibles
 * - d'optimiser les performances
 * - de garder un format de réponse stable
 */
const learnerSelect = {
  id: true,
  firstname: true,
  lastname: true,

  // Informations du profil utilisateur
  profile: {
    select: {
      bio: true,
      level: true,
      availability: true,
      location: true,
    },
  },

  // Compétences associées à l'utilisateur
  skills: {
    select: {
      level: true,

      // Détails de la compétence
      skill: {
        select: {
          id: true,
          name: true,
          category: true,
        },
      },
    },
  },
} satisfies Prisma.UserSelect;

/**
 * Type TypeScript représentant exactement
 * le format retourné par la requête Prisma.
 *
 * Grâce à Prisma.UserGetPayload, le type SearchLearner
 * reste synchronisé avec learnerSelect.
 */
export type SearchLearner = Prisma.UserGetPayload<{
  select: typeof learnerSelect;
}>;

/**
 * Repository dédié à la recherche d'apprenants.
 *
 * Il centralise la construction dynamique des filtres
 * et l'exécution de la requête Prisma.
 */
export const searchRepository = {
  /**
   * Recherche des apprenants selon plusieurs filtres optionnels.
   *
   * Filtres possibles :
   * - compétence
   * - niveau
   * - ville
   * - pagination
   *
   * @param filters Filtres de recherche
   * @returns Liste des apprenants correspondant aux critères
   */
  searchLearners(filters: SearchLearnersFilters): Promise<SearchLearner[]> {
    /**
     * Condition principale appliquée sur la table User.
     *
     * Par défaut :
     * - on exclut l'utilisateur connecté
     * - on ne récupère que les comptes actifs
     */
    const where: Prisma.UserWhereInput = {
      id: {
        not: filters.userId,
      },
      status: UserStatus.ACTIVE,
    };

    /**
     * Filtres appliqués sur le profil utilisateur.
     *
     * Cet objet est construit progressivement
     * uniquement si certains filtres sont fournis.
     */
    const profileWhere: Prisma.ProfileWhereInput = {};

    // Filtre par niveau du profil
    if (filters.level) {
      profileWhere.level = filters.level;
    }

    // Filtre par ville ou localisation
    if (filters.city) {
      profileWhere.location = {
        contains: filters.city,
      };
    }

    // Ajoute le filtre profile uniquement s'il contient au moins une condition
    if (Object.keys(profileWhere).length > 0) {
      where.profile = {
        is: profileWhere,
      };
    }

    /**
     * Filtres appliqués aux compétences de l'utilisateur.
     *
     * Ils permettent de rechercher les utilisateurs
     * possédant une compétence précise ou un niveau précis.
     */
    const userSkillWhere: Prisma.UserSkillWhereInput = {};

    // Filtre par niveau de compétence
    if (filters.level) {
      userSkillWhere.level = filters.level;
    }

    // Filtre par nom de compétence
    if (filters.skill) {
      userSkillWhere.skill = {
        name: {
          contains: filters.skill,
        },
      };
    }

    // Vérifie si un filtre sur les compétences doit être appliqué
    const shouldFilterSkills = Object.keys(userSkillWhere).length > 0;

    /**
     * Si un filtre de compétence existe,
     * on recherche uniquement les utilisateurs
     * ayant au moins une compétence correspondant aux critères.
     */
    if (shouldFilterSkills) {
      where.skills = {
        some: userSkillWhere,
      };
    }

    /**
     * Gestion de la pagination.
     *
     * La pagination n'est activée que si page ou limit est fourni.
     * Sinon, tous les résultats correspondant aux filtres sont retournés.
     */
    const shouldPaginate =
      filters.page !== undefined || filters.limit !== undefined;

    // Valeurs par défaut si la pagination est activée partiellement
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;

    return prisma.user.findMany({
      where,

      /**
       * Sélection des champs retournés.
       *
       * On réutilise learnerSelect,
       * mais on personnalise la sélection des skills
       * pour éventuellement filtrer les compétences retournées.
       */
      select: {
        ...learnerSelect,

        skills: {
          // Si un filtre skill/level existe, seules les compétences concernées sont retournées
          ...(shouldFilterSkills ? { where: userSkillWhere } : {}),

          // Réutilisation de la sélection définie dans learnerSelect
          select: learnerSelect.skills.select,
        },
      },

      // Tri alphabétique des apprenants par prénom
      orderBy: {
        firstname: "asc",
      },

      // Ajout conditionnel de skip/take uniquement si la pagination est demandée
      ...(shouldPaginate
        ? {
            skip: (page - 1) * limit,
            take: limit,
          }
        : {}),
    });
  },
};
