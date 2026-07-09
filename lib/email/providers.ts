import type { ReactElement } from "react";
import { Resend } from "resend";
import { env } from "@/lib/config/env";

export type EmailMessage = {
  to: string;
  subject: string;
  react: ReactElement;
};

export type EmailProvider = {
  send: (message: EmailMessage) => Promise<void>;
};

class ResendEmailProvider implements EmailProvider {
  private readonly client = new Resend(env.RESEND_API_KEY);

  async send(message: EmailMessage): Promise<void> {
    const { error } = await this.client.emails.send({
      from: env.EMAIL_FROM,
      to: message.to,
      subject: message.subject,
      react: message.react,
    });

    if (error) {
      throw new Error(error.message);
    }
  }
}

export const emailProvider: EmailProvider = new ResendEmailProvider();
