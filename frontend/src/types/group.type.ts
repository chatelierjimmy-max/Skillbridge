import type { Level } from "./profile.type";
import type { Skill } from "./skill.type";

export type GroupRole = "OWNER" | "MEMBER";

export interface GroupListItem {
  id: number;
  name: string;
  description?: string;
  level?: Level;
  skill: Skill;
  owner: {
    id: number;
    firstname: string;
    lastname: string;
  };
  membersCount: number;
  createdAt: string;
}

export interface GroupMember {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: GroupRole;
  joinedAt: string;
}

export interface GroupDetail {
  id: number;
  name: string;
  description?: string;
  level?: Level;
  skill: Skill;
  owner: {
    id: number;
    firstname: string;
    lastname: string;
  };
  members: GroupMember[];
  createdAt: string;
}

export interface CreateGroupData {
  name: string;
  description?: string;
  level: Level;
  skillId: number;
}
