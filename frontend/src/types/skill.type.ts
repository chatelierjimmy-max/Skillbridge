import type { Level } from "./profile.type";

export interface Skill {
  id: number;
  name: string;
  category?: string;
}

export interface UserSkill extends Skill {
  level: Level;
}
