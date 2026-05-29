import { api } from "./api";
import type {
  CreateGroupData,
  GroupDetail,
  GroupListItem,
  MyGroup,
} from "../types/group.type";

export const groupService = {
  async getGroups() {
    const response = await api.get<GroupListItem[]>("/groups");
    return response.data;
  },

  async getMyGroups() {
    const response = await api.get<MyGroup[]>("/groups/me");
    return response.data;
  },

  async getGroupById(id: number) {
    const response = await api.get<GroupDetail>(`/groups/${id}`);
    return response.data;
  },

  async createGroup(data: CreateGroupData) {
    const response = await api.post("/groups", data);
    return response.data;
  },

  async joinGroup(id: number) {
    const response = await api.post(`/groups/${id}/join`);
    return response.data;
  },

  async leaveGroup(id: number) {
    const response = await api.delete(`/groups/${id}/leave`);
    return response.data;
  },
};
