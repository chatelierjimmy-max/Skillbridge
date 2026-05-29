import { BookingStatus } from "@prisma/client";
import { sessionRepository } from "../repositories/session.repository";
import { groupRepository } from "../repositories/group.repository";
import { AppError } from "../utils/AppError";
import { notificationService } from "./notification.service";
import { logService } from "./log.service";

interface CreateSessionInput {
  title: string;
  description?: string;
  startDate: string;
  duration: number;
  maxParticipants?: number;
}

export const sessionService = {
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
      registeredCount: session.bookings.length,
      isRegistered: session.bookings.some(
        (booking) => booking.userId === userId,
      ),
      creator: session.creator,
    }));
  },

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

    await sessionRepository.createBooking(userId, session.id);

    await logService.activity("CREATE_SESSION", { userId }, "SESSION", session.id);

    const group = await groupRepository.findById(groupId);

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
