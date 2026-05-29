export type NotificationType =
  | "GROUP_JOINED"
  | "SESSION_CREATED"
  | "MESSAGE_RECEIVED"
  | "ACCOUNT_DISABLED";

export interface AppNotification {
  _id: string;
  userId: number;
  type: NotificationType;
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}
