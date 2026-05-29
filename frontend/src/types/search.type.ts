import type { Level } from "./profile.type";
import type { UserSkill } from "./skill.type";

export interface LearnerResult {
  id: number;
  firstname: string;
  lastname: string;
  profile: {
    bio?: string;
    level?: Level;
    availability?: string;
    location?: string;
  } | null;
  skills: UserSkill[];
}

export interface SearchFilters {
  skill?: string;
  level?: Level | "";
  city?: string;
}
