import { BookingStatus } from "@prisma/client";
import { prisma } from "../config/prisma";

interface CreateSessionData {
  groupId: number;
  title: string;
  description?: string;
  startDate: Date;
  duration: number;
  maxParticipants?: number;
  createdBy: number;
}

export const sessionRepository = {
  findGroupSessions(groupId: number) {
    return prisma.session.findMany({
      where: { groupId },
      include: {
        bookings: {
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
      orderBy: {
        startDate: "asc",
      },
    });
  },

  findById(id: number) {
    return prisma.session.findUnique({
      where: { id },
      include: {
        group: true,
        bookings: true,
      },
    });
  },

  create(data: CreateSessionData) {
    return prisma.session.create({
      data: {
        groupId: data.groupId,
        title: data.title,
        ...(data.description !== undefined
          ? { description: data.description }
          : {}),
        startDate: data.startDate,
        duration: data.duration,
        ...(data.maxParticipants !== undefined
          ? { maxParticipants: data.maxParticipants }
          : {}),
        createdBy: data.createdBy,
      },
    });
  },

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

  createBooking(userId: number, sessionId: number) {
    return prisma.booking.create({
      data: {
        userId,
        sessionId,
        status: BookingStatus.REGISTERED,
      },
    });
  },

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

  countRegisteredBookings(sessionId: number) {
    return prisma.booking.count({
      where: {
        sessionId,
        status: BookingStatus.REGISTERED,
      },
    });
  },

  findUserSessions(userId: number) {
    return prisma.booking.findMany({
      where: {
        userId,
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
      orderBy: {
        bookedAt: "asc",
      },
    });
  },
};
