import mongoose, { Schema, Document } from "mongoose";

export type NotificationType =
  | "GROUP_JOINED"
  | "SESSION_CREATED"
  | "MESSAGE_RECEIVED"
  | "ACCOUNT_DISABLED";

export interface INotification extends Document {
  userId: number;
  type: NotificationType;
  title: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: Number, required: true, index: true },
    type: {
      type: String,
      required: true,
      enum: [
        "GROUP_JOINED",
        "SESSION_CREATED",
        "MESSAGE_RECEIVED",
        "ACCOUNT_DISABLED",
      ],
    },
    title: { type: String, required: true, maxlength: 150 },
    content: { type: String, required: true, maxlength: 500 },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const NotificationModel = mongoose.model<INotification>(
  "Notification",
  notificationSchema,
);
