import {
  ActivityLogModel,
  type ActivityAction,
} from "../models/activityLog.model";
import {
  SecurityLogModel,
  type SecurityEvent,
} from "../models/securityLog.model";

interface BaseLogData {
  userId?: number | undefined;
  ipAddress?: string | undefined;
  userAgent?: string | undefined;
}

interface ActivityLogData extends BaseLogData {
  action: ActivityAction;
  targetType?: string | undefined;
  targetId?: string | number | undefined;
}

interface SecurityLogData extends BaseLogData {
  email?: string | undefined;
  event: SecurityEvent;
  reason?: string | undefined;
}

export const logRepository = {
  createActivityLog(data: ActivityLogData) {
    return ActivityLogModel.create({
      action: data.action,
      ...(data.userId !== undefined ? { userId: data.userId } : {}),
      ...(data.targetType !== undefined ? { targetType: data.targetType } : {}),
      ...(data.targetId !== undefined ? { targetId: data.targetId } : {}),
      ...(data.ipAddress !== undefined ? { ipAddress: data.ipAddress } : {}),
      ...(data.userAgent !== undefined ? { userAgent: data.userAgent } : {}),
    });
  },

  createSecurityLog(data: SecurityLogData) {
    return SecurityLogModel.create({
      event: data.event,
      ...(data.userId !== undefined ? { userId: data.userId } : {}),
      ...(data.email !== undefined ? { email: data.email } : {}),
      ...(data.reason !== undefined ? { reason: data.reason } : {}),
      ...(data.ipAddress !== undefined ? { ipAddress: data.ipAddress } : {}),
      ...(data.userAgent !== undefined ? { userAgent: data.userAgent } : {}),
    });
  },

  findActivityLogs() {
    return ActivityLogModel.find().sort({ createdAt: -1 }).limit(100).lean();
  },

  findSecurityLogs() {
    return SecurityLogModel.find().sort({ createdAt: -1 }).limit(100).lean();
  },
};
