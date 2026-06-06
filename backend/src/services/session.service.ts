// Import de l'enum BookingStatus générée par Prisma.
// Elle représente les états possibles d'une réservation.
import { BookingStatus } from "@prisma/client";

// Repository des sessions.
// Il centralise les opérations liées aux sessions et réservations.
import { sessionRepository } from "../repositories/session.repository";

// Repository des groupes.
// Utilisé pour vérifier l'existence des groupes et les adhésions.
import { groupRepository } from "../repositories/group.repository";

// Classe d'erreur personnalisée.
// Permet de lever des erreurs HTTP métier contrôlées.
import { AppError } from "../utils/AppError";

// Service de notifications.
import { notificationService } from "./notification.service";

// Service de journalisation.
import { logService } from "./log.service";

/**
 * Données nécessaires à la création d'une session.
 */
interface CreateSessionInput {
  title: string;
  description?: string;
  startDate: string;
  duration: number;
  maxParticipants?: number;
}

/**
 * Service métier des sessions.
 *
 * Gère :
 * - la consultation des sessions d'un groupe
 * - la création de sessions
 * - l'inscription à une session
 * - l'annulation d'une réservation
 * - la liste des sessions de l'utilisateur connecté
 */
export const sessionService = {
  /**
   * Récupère les sessions d'un groupe.
   *
   * Retourne aussi :
   * - le nombre d'inscrits
   * - si l'utilisateur connecté est déjà inscrit
   * - les informations du créateur
   */
  async getGroupSessions(userId: number, groupId: number) {
    const group = await groupRepository.findById(groupId);

    if (!group) {
      throw new AppError("Groupe introuvable", 404);
    }

    const sessions = await sessionRepository.findGroupSessions(groupId);

    return sessions.map((session) => ({
      id: session.id,
      title: session.title,
      description: session.description,
      startDate: session.startDate,
      duration: session.duration,
      maxParticipants: session.maxParticipants,

      // Nombre de réservations actives.
      registeredCount: session.bookings.length,

      // Indique si l'utilisateur connecté est inscrit à cette session.
      isRegistered: session.bookings.some(
        (booking) => booking.userId === userId,
      ),

      creator: session.creator,
    }));
  },

  /**
   * Crée une session dans un groupe.
   *
   * Règles :
   * - l'utilisateur doit être membre du groupe ;
   * - la date doit être valide ;
   * - la session doit être planifiée dans le futur ;
   * - le créateur est automatiquement inscrit.
   */
  async createSession(
    userId: number,
    groupId: number,
    data: CreateSessionInput,
  ) {
    const membership = await groupRepository.findMembership(userId, groupId);

    if (!membership) {
      throw new AppError(
        "Vous devez être membre du groupe pour créer une session",
        403,
      );
    }

    const startDate = new Date(data.startDate);

    if (Number.isNaN(startDate.getTime())) {
      throw new AppError("Date de session invalide", 400);
    }

    if (startDate <= new Date()) {
      throw new AppError("La date de session doit être dans le futur", 400);
    }

    const session = await sessionRepository.create({
      groupId,
      title: data.title,
      ...(data.description !== undefined
        ? { description: data.description }
        : {}),
      startDate,
      duration: data.duration,
      ...(data.maxParticipants !== undefined
        ? { maxParticipants: data.maxParticipants }
        : {}),
      createdBy: userId,
    });

    // Le créateur est automatiquement inscrit à sa propre session.
    await sessionRepository.createBooking(userId, session.id);

    await logService.activity(
      "CREATE_SESSION",
      { userId },
      "SESSION",
      session.id,
    );

    const group = await groupRepository.findById(groupId);

    // Notification envoyée à tous les autres membres du groupe.
    if (group) {
      await Promise.all(
        group.members
          .filter((member) => member.user.id !== userId)
          .map((member) =>
            notificationService.createNotification({
              userId: member.user.id,
              type: "SESSION_CREATED",
              title: "Nouvelle session",
              content: `Une nouvelle session a été créée dans le groupe ${group.name}.`,
            }),
          ),
      );
    }

    return session;
  },

  /**
   * Inscrit un utilisateur à une session.
   *
   * Gère aussi le cas d'une réservation précédemment annulée.
   */
  async bookSession(userId: number, sessionId: number) {
    const session = await sessionRepository.findById(sessionId);

    if (!session) {
      throw new AppError("Session introuvable", 404);
    }

    if (session.startDate <= new Date()) {
      throw new AppError("Impossible de s'inscrire à une session passée", 400);
    }

    const membership = await groupRepository.findMembership(
      userId,
      session.groupId,
    );

    if (!membership) {
      throw new AppError(
        "Vous devez être membre du groupe pour vous inscrire",
        403,
      );
    }

    const registeredCount =
      await sessionRepository.countRegisteredBookings(sessionId);

    if (session.maxParticipants && registeredCount >= session.maxParticipants) {
      throw new AppError("La session est complète", 409);
    }

    const existingBooking = await sessionRepository.findBooking(
      userId,
      sessionId,
    );

    if (existingBooking?.status === BookingStatus.REGISTERED) {
      throw new AppError("Vous êtes déjà inscrit à cette session", 409);
    }

    if (existingBooking?.status === BookingStatus.CANCELLED) {
      await sessionRepository.reactivateBooking(userId, sessionId);

      return {
        message: "Inscription à la session confirmée",
      };
    }

    await sessionRepository.createBooking(userId, sessionId);

    return {
      message: "Inscription à la session confirmée",
    };
  },

  /**
   * Annule l'inscription d'un utilisateur à une session.
   *
   * La réservation n'est pas supprimée :
   * son statut passe à CANCELLED.
   */
  async cancelBooking(userId: number, sessionId: number) {
    const session = await sessionRepository.findById(sessionId);

    if (!session) {
      throw new AppError("Session introuvable", 404);
    }

    if (session.startDate <= new Date()) {
      throw new AppError("Impossible d'annuler une session passée", 400);
    }

    const existingBooking = await sessionRepository.findBooking(
      userId,
      sessionId,
    );

    if (
      !existingBooking ||
      existingBooking.status === BookingStatus.CANCELLED
    ) {
      throw new AppError("Vous n'êtes pas inscrit à cette session", 404);
    }

    await sessionRepository.cancelBooking(userId, sessionId);

    return {
      message: "Participation annulée",
    };
  },

  /**
   * Récupère toutes les sessions auxquelles
   * l'utilisateur connecté est inscrit.
   */
  async getMySessions(userId: number) {
    const bookings = await sessionRepository.findUserSessions(userId);

    return bookings.map((booking) => ({
      id: booking.session.id,
      title: booking.session.title,
      description: booking.session.description,
      startDate: booking.session.startDate,
      duration: booking.session.duration,
      group: {
        id: booking.session.group.id,
        name: booking.session.group.name,
        skill: booking.session.group.skill.name,
      },
      bookingStatus: booking.status,
    }));
  },
};
