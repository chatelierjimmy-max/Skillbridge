export interface GroupSession {
  id: number;
  title: string;
  description?: string;
  startDate: string;
  duration: number;
  maxParticipants?: number;
  registeredCount: number;
  isRegistered: boolean;
  creator: {
    id: number;
    firstname: string;
    lastname: string;
  };
}

export interface MySession {
  id: number;
  title: string;
  description?: string;
  startDate: string;
  duration: number;
  group: {
    id: number;
    name: string;
    skill: string;
  };
  bookingStatus: "REGISTERED" | "CANCELLED";
}

export interface CreateSessionData {
  title: string;
  description?: string;
  startDate: string;
  duration: number;
  maxParticipants?: number;
}
