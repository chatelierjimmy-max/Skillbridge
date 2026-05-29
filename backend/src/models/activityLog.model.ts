import mongoose, { Schema, Document } from "mongoose";

export type ActivityAction =
  | "REGISTER"
  | "LOGIN"
  | "UPDATE_PROFILE"
  | "CREATE_GROUP"
  | "JOIN_GROUP"
  | "LEAVE_GROUP"
  | "CREATE_SESSION"
  | "SEND_MESSAGE"
  | "DELETE_MESSAGE";

export interface IActivityLog extends Document {
  userId?: number;
  action: ActivityAction;
  targetType?: string;
  targetId?: string | number;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

const activityLogSchema = new Schema<IActivityLog>(
  {
    userId: { type: Number, index: true },
    action: {
      type: String,
      required: true,
      enum: [
        "REGISTER",
        "LOGIN",
        "UPDATE_PROFILE",
        "CREATE_GROUP",
        "JOIN_GROUP",
        "LEAVE_GROUP",
        "CREATE_SESSION",
        "SEND_MESSAGE",
        "DELETE_MESSAGE",
      ],
    },
    targetType: { type: String, maxlength: 100 },
    targetId: { type: Schema.Types.Mixed },
    ipAddress: { type: String, maxlength: 100 },
    userAgent: { type: String, maxlength: 255 },
  },
  { timestamps: true },
);

export const ActivityLogModel = mongoose.model<IActivityLog>(
  "ActivityLog",
  activityLogSchema,
);
