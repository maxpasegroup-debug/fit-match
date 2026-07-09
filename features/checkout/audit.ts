import { prisma } from "@/lib/db/prisma";
import { logger } from "@/lib/logger";

export async function logCustomerAudit(input: {
  action: string;
  entityType: string;
  entityId?: string;
  message: string;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        message: input.message,
      },
    });
  } catch (error) {
    logger.error({ error, input }, "customer audit logging failed");
  }
}
