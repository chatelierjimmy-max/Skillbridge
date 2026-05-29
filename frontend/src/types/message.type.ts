export interface MessageAuthor {
  id: number;
  firstname: string;
  lastname: string;
}

export interface GroupMessage {
  id: string;
  groupId: number;
  userId: number;
  author: MessageAuthor | null;
  content: string;
  createdAt: string;
}

export interface CreateMessageData {
  content: string;
}
