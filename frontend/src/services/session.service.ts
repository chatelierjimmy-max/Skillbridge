import { api } from "./api";
import type {
  CreateSessionData,
  GroupSession,
  MySession,
} from "../types/session.type";

export const sessionService = {
  async getGroupSessions(groupId: number) {
    const response = await api.get<GroupSession[]>(
      `/groups/${groupId}/sessions`,
    );

    return response.data;
  },

  async createSession(groupId: number, data: CreateSessionData) {
    const response = await api.post(`/groups/${groupId}/sessions`, data);

    return response.data;
  },

  async bookSession(sessionId: number) {
    const response = await api.post(`/sessions/${sessionId}/book`);

    return response.data;
  },

  async cancelBooking(sessionId: number) {
    const response = await api.delete(`/sessions/${sessionId}/book`);

    return response.data;
  },

  async getMySessions() {
    const response = await api.get<MySession[]>("/users/me/sessions");

    return response.data;
  },
};
