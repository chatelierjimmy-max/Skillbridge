// Import de l'enum BookingStatus générée par Prisma.
// Elle représente les différents états possibles d'une réservation.
import { BookingStatus } from "@prisma/client";

// Import de l'instance Prisma configurée pour communiquer avec la base de données.
import { prisma } from "../config/prisma";

/**
 * Interface représentant les données nécessaires
 * à la création d'une session.
 */
interface CreateSessionData {
  // Identifiant du groupe auquel la session est rattachée
  groupId: number;

  // Titre de la session
  title: string;

  // Description optionnelle de la session
  description?: string;

  // Date et heure de début de la session
  startDate: Date;

  // Durée de la session, généralement exprimée en minutes
  duration: number;

  // Nombre maximum de participants autorisés
  maxParticipants?: number;

  // Identifiant de l'utilisateur qui crée la session
  createdBy: number;
}

/**
 * Repository responsable de la gestion des sessions
 * et des réservations associées.
 */
export const sessionRepository = {
  /**
   * Récupère toutes les sessions d'un groupe.
   *
   * Inclut :
   * - les réservations actives uniquement
   * - le créateur de la session
   *
   * Les sessions sont triées par date de début croissante.
   *
   * @param groupId Identifiant du groupe
   */
  findGroupSessions(groupId: number) {
    return prisma.session.findMany({
      where: { groupId },

      include: {
        bookings: {
          // Ne récupère que les inscriptions confirmées
          where: {
            status: BookingStatus.REGISTERED,
          },
        },

        creator: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
          },
        },
      },

      // Tri chronologique : prochaine session en premier
      orderBy: {
        startDate: "asc",
      },
    });
  },

  /**
   * Recherche une session par son identifiant.
   *
   * Retourne également :
   * - le groupe associé
   * - toutes les réservations liées à cette session
   *
   * @param id Identifiant de la session
   */
  findById(id: number) {
    return prisma.session.findUnique({
      where: { id },
      include: {
        group: true,
        bookings: true,
      },
    });
  },

  /**
   * Crée une nouvelle session.
   *
   * Les champs optionnels comme description et maxParticipants
   * sont ajoutés uniquement lorsqu'ils sont définis.
   *
   * @param data Données de création de la session
   */
  create(data: CreateSessionData) {
    return prisma.session.create({
      data: {
        groupId: data.groupId,
        title: data.title,

        // Ajout conditionnel de la description
        ...(data.description !== undefined
          ? { description: data.description }
          : {}),

        startDate: data.startDate,
        duration: data.duration,

        // Ajout conditionnel du nombre maximum de participants
        ...(data.maxParticipants !== undefined
          ? { maxParticipants: data.maxParticipants }
          : {}),

        createdBy: data.createdBy,
      },
    });
  },

  /**
   * Recherche la réservation d'un utilisateur
   * pour une session précise.
   *
   * Utilise une clé unique composée :
   * - sessionId
   * - userId
   *
   * @param userId Identifiant de l'utilisateur
   * @param sessionId Identifiant de la session
   */
  findBooking(userId: number, sessionId: number) {
    return prisma.booking.findUnique({
      where: {
        sessionId_userId: {
          sessionId,
          userId,
        },
      },
    });
  },

  /**
   * Crée une réservation pour une session.
   *
   * Le statut est automatiquement défini à REGISTERED,
   * ce qui signifie que l'utilisateur est inscrit.
   *
   * @param userId Identifiant de l'utilisateur
   * @param sessionId Identifiant de la session
   */
  createBooking(userId: number, sessionId: number) {
    return prisma.booking.create({
      data: {
        userId,
        sessionId,
        status: BookingStatus.REGISTERED,
      },
    });
  },

  /**
   * Réactive une réservation précédemment annulée.
   *
   * Utile si un utilisateur avait annulé sa participation,
   * puis décide de se réinscrire à la même session.
   *
   * @param userId Identifiant de l'utilisateur
   * @param sessionId Identifiant de la session
   */
  reactivateBooking(userId: number, sessionId: number) {
    return prisma.booking.update({
      where: {
        sessionId_userId: {
          sessionId,
          userId,
        },
      },
      data: {
        status: BookingStatus.REGISTERED,
      },
    });
  },

  /**
   * Annule la réservation d'un utilisateur.
   *
   * La réservation n'est pas supprimée de la base.
   * Son statut passe simplement à CANCELLED.
   *
   * Cela permet de conserver un historique des inscriptions.
   *
   * @param userId Identifiant de l'utilisateur
   * @param sessionId Identifiant de la session
   */
  cancelBooking(userId: number, sessionId: number) {
    return prisma.booking.update({
      where: {
        sessionId_userId: {
          sessionId,
          userId,
        },
      },
      data: {
        status: BookingStatus.CANCELLED,
      },
    });
  },

  /**
   * Compte le nombre de participants inscrits à une session.
   *
   * Seules les réservations avec le statut REGISTERED
   * sont prises en compte.
   *
   * @param sessionId Identifiant de la session
   * @returns Nombre de participants actifs
   */
  countRegisteredBookings(sessionId: number) {
    return prisma.booking.count({
      where: {
        sessionId,
        status: BookingStatus.REGISTERED,
      },
    });
  },

  /**
   * Récupère toutes les sessions auxquelles
   * un utilisateur est inscrit.
   *
   * Inclut :
   * - la session réservée
   * - le groupe associé
   * - la compétence liée au groupe
   *
   * @param userId Identifiant de l'utilisateur
   */
  findUserSessions(userId: number) {
    return prisma.booking.findMany({
      where: {
        userId,

        // On ne récupère que les réservations actives
        status: BookingStatus.REGISTERED,
      },

      include: {
        session: {
          include: {
            group: {
              include: {
                skill: true,
              },
            },
          },
        },
      },

      // Trie selon la date de réservation
      orderBy: {
        bookedAt: "asc",
      },
    });
  },
};
