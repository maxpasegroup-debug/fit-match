import { z } from "zod";

const clientEnvSchema = z.object({
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  NEXT_PUBLIC_RAZORPAY_KEY_ID: z.string().default(""),
});

const parsedClientEnv = clientEnvSchema.safeParse({
  NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
});

if (!parsedClientEnv.success) {
  const message = parsedClientEnv.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("; ");
  throw new Error(`Invalid public environment configuration: ${message}`);
}

export const clientEnv = parsedClientEnv.data;
