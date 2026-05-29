export type Level = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export interface Profile {
  id: number;
  userId: number;
  bio?: string;
  level?: Level;
  availability?: string;
  location?: string;
}
