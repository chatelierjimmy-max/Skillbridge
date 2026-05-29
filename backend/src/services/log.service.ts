import type { ActivityAction } from "../models/activityLog.model";
import type { SecurityEvent } from "../models/securityLog.model";
import { logRepository } from "../repositories/log.repository";

interface LogContext {
  userId?: number | undefined;
  email?: string | undefined;
  ipAddress?: string | undefined;
  userAgent?: string | undefined;
}

export const logService = {
  async activity(
    action: ActivityAction,
    context: LogContext,
    targetType?: string,
    targetId?: string | number,
  ) {
    return logRepository.createActivityLog({
      userId: context.userId,
      action,
      targetType,
      targetId,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
    });
  },

  async security(event: SecurityEvent, context: LogContext, reason?: string) {
    return logRepository.createSecurityLog({
      userId: context.userId,
      email: context.email,
      event,
      reason,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
    });
  },

  async getActivityLogs() {
    return logRepository.findActivityLogs();
  },

  async getSecurityLogs() {
    return logRepository.findSecurityLogs();
  },
};
