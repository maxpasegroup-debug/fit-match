import { emailProvider, type EmailMessage } from "@/lib/email/providers";
import { logger } from "@/lib/logger";

export async function sendEmail(message: EmailMessage): Promise<void> {
  try {
    await emailProvider.send(message);
  } catch (error) {
    logger.error({ error, to: message.to, subject: message.subject }, "email send failed");
    throw error;
  }
}
