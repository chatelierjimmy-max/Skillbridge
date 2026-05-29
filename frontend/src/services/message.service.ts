import { api } from "./api";
import type { CreateMessageData, GroupMessage } from "../types/message.type";

export const messageService = {
  async getGroupMessages(groupId: number) {
    const response = await api.get<GroupMessage[]>(
      `/groups/${groupId}/messages`,
    );

    return response.data;
  },

  async createMessage(groupId: number, data: CreateMessageData) {
    const response = await api.post(`/groups/${groupId}/messages`, data);

    return response.data;
  },

  async deleteMessage(messageId: string) {
    const response = await api.delete(`/messages/${messageId}`);

    return response.data;
  },
};
