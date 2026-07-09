"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { env } from "@/lib/config/env";
import { createSession, destroySession } from "@/lib/auth/session";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { addMinutes, createSecureToken, hashToken } from "@/lib/utils/crypto";
import { sendEmail } from "@/lib/email/sendEmail";
import {
  ForgotPasswordEmail,
  PasswordChangedEmail,
  VerifyEmail,
  WelcomeEmail,
} from "@/lib/email/templates";
import { logError } from "@/lib/logger";
import { rateLimitServerAction } from "@/lib/rate-limit/server-action";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "@/features/auth/schemas";

type ActionState = {
  ok: boolean;
  message: string;
};

function formValue(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

async function sendVerificationEmail(email: string, name: string): Promise<void> {
  await prisma.verificationToken.deleteMany({ where: { email } });
  const token = createSecureToken();
  await prisma.verificationToken.create({
    data: {
      email,
      tokenHash: hashToken(token),
      expiresAt: addMinutes(new Date(), 60 * 24),
    },
  });
  const verifyUrl = `${env.APP_URL}/verify-email?token=${token}`;
  await sendEmail({
    to: email,
    subject: "Verify your SIGN SILKS account",
    react: <VerifyEmail name={name} verifyUrl={verifyUrl} />,
  });
}

export async function registerAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const allowed = await rateLimitServerAction("register:action", {
    limit: 5,
    windowMs: 60 * 60_000,
  });
  if (!allowed) {
    return { ok: false, message: "Too many attempts. Please try again later." };
  }

  const parsed = registerSchema.safeParse({
    name: formValue(formData, "name"),
    email: formValue(formData, "email"),
    password: formValue(formData, "password"),
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid details" };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: parsed.data.email },
    select: { id: true },
  });

  if (existingUser) {
    return { ok: false, message: "An account with this email already exists." };
  }

  try {
    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        passwordHash: await hashPassword(parsed.data.password),
      },
    });

    await sendVerificationEmail(user.email, user.name);
    await sendEmail({
      to: user.email,
      subject: "Welcome to FIT & Match",
      react: <WelcomeEmail name={user.name} />,
    });
    await createSession(user.id);
  } catch (error) {
    logError(error, "registration failed");
    return { ok: false, message: "We could not create your account right now." };
  }

  redirect("/home");
}

export async function loginAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const allowed = await rateLimitServerAction("login:action", {
    limit: 8,
    windowMs: 15 * 60_000,
  });
  if (!allowed) {
    return { ok: false, message: "Too many attempts. Please try again later." };
  }

  const parsed = loginSchema.safeParse({
    email: formValue(formData, "email"),
    password: formValue(formData, "password"),
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid login" };
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
    return { ok: false, message: "Email or password is incorrect." };
  }

  try {
    await createSession(user.id);
  } catch (error) {
    logError(error, "login session creation failed");
    return { ok: false, message: "We could not log you in right now." };
  }
  redirect("/home");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/");
}

export async function forgotPasswordAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const allowed = await rateLimitServerAction("forgot-password:action", {
    limit: 4,
    windowMs: 60 * 60_000,
  });
  if (!allowed) {
    return { ok: false, message: "Too many attempts. Please try again later." };
  }

  const parsed = forgotPasswordSchema.safeParse({
    email: formValue(formData, "email"),
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid email" };
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (user) {
    await prisma.passwordResetToken.deleteMany({ where: { email: user.email } });
    const token = createSecureToken();
    await prisma.passwordResetToken.create({
      data: {
        email: user.email,
        tokenHash: hashToken(token),
        expiresAt: addMinutes(new Date(), 30),
      },
    });
    try {
      await sendEmail({
        to: user.email,
        subject: "Reset your FIT & Match password",
        react: (
          <ForgotPasswordEmail
            name={user.name}
            resetUrl={`${env.APP_URL}/reset-password?token=${token}`}
          />
        ),
      });
    } catch (error) {
      logError(error, "password reset email failed");
    }
  }

  return {
    ok: true,
    message: "If this email exists, a reset link has been sent.",
  };
}

export async function resetPasswordAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const allowed = await rateLimitServerAction("reset-password:action", {
    limit: 5,
    windowMs: 60 * 60_000,
  });
  if (!allowed) {
    return { ok: false, message: "Too many attempts. Please try again later." };
  }

  const parsed = resetPasswordSchema.safeParse({
    token: formValue(formData, "token"),
    password: formValue(formData, "password"),
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid reset" };
  }

  const token = await prisma.passwordResetToken.findUnique({
    where: { tokenHash: hashToken(parsed.data.token) },
  });

  if (!token || token.expiresAt < new Date()) {
    return { ok: false, message: "This reset link has expired." };
  }

  const user = await prisma.user.update({
    where: { email: token.email },
    data: { passwordHash: await hashPassword(parsed.data.password) },
  });

  await prisma.passwordResetToken.deleteMany({ where: { email: user.email } });
  await prisma.session.deleteMany({ where: { userId: user.id } });
  try {
    await sendEmail({
      to: user.email,
      subject: "Your FIT & Match password was changed",
      react: <PasswordChangedEmail name={user.name} />,
    });
  } catch (error) {
    logError(error, "password changed email failed");
  }

  return { ok: true, message: "Password changed. You can now log in." };
}

export async function verifyEmailToken(token: string): Promise<boolean> {
  const record = await prisma.verificationToken.findUnique({
    where: { tokenHash: hashToken(token) },
  });

  if (!record || record.expiresAt < new Date()) {
    return false;
  }

  await prisma.user.update({
    where: { email: record.email },
    data: { emailVerified: new Date() },
  });
  await prisma.verificationToken.deleteMany({ where: { email: record.email } });
  return true;
}
