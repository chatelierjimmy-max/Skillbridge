import mongoose, { Schema, Document } from "mongoose";

export type SecurityEvent =
  | "LOGIN_SUCCESS"
  | "LOGIN_FAILED"
  | "ACCESS_DENIED"
  | "TOKEN_INVALID"
  | "ACCOUNT_DISABLED"
  | "PASSWORD_RESET_REQUEST"
  | "PASSWORD_RESET_SUCCESS"
  | "PASSWORD_RESET_FAILED";

export interface ISecurityLog extends Document {
  userId?: number;
  email?: string;
  event: SecurityEvent;
  reason?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

const securityLogSchema = new Schema<ISecurityLog>(
  {
    userId: { type: Number, index: true },
    email: { type: String, lowercase: true, trim: true },
    event: {
      type: String,
      required: true,
      enum: [
        "LOGIN_SUCCESS",
        "LOGIN_FAILED",
        "ACCESS_DENIED",
        "TOKEN_INVALID",
        "ACCOUNT_DISABLED",
        "PASSWORD_RESET_REQUEST",
        "PASSWORD_RESET_SUCCESS",
        "PASSWORD_RESET_FAILED",
      ],
    },
    reason: { type: String, maxlength: 255 },
    ipAddress: { type: String, maxlength: 100 },
    userAgent: { type: String, maxlength: 255 },
  },
  { timestamps: true },
);

export const SecurityLogModel = mongoose.model<ISecurityLog>(
  "SecurityLog",
  securityLogSchema,
);
