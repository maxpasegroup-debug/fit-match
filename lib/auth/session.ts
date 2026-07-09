import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { prisma } from "@/lib/db/prisma";
import { env } from "@/lib/config/env";
import { hashToken } from "@/lib/utils/crypto";
import { sessionCookieName, sessionCookieOptions } from "@/lib/auth/cookies";
import { sessionDurations, type CreateSessionOptions } from "@/lib/auth/session-options";
import type { AuthUser, SessionPayload } from "@/types/auth";

const key = new TextEncoder().encode(env.AUTH_SECRET);

async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(key);
}

async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const result = await jwtVerify<SessionPayload>(token, key);
    return result.payload;
  } catch {
    return null;
  }
}

export async function createSession(
  userId: string,
  options: CreateSessionOptions = {},
): Promise<void> {
  const maxAge = options.rememberMe ? sessionDurations.rememberMe : sessionDurations.standard;
  const expiresAt = new Date(Date.now() + maxAge * 1000);
  const session = await prisma.session.create({
    data: {
      userId,
      tokenHash: hashToken(crypto.randomUUID()),
      expiresAt,
    },
    select: { id: true },
  });
  const token = await signSession({ sessionId: session.id, userId });
  const cookieStore = await cookies();
  cookieStore.set(sessionCookieName, token, { ...sessionCookieOptions, maxAge });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName)?.value;
  if (token) {
    const payload = await verifySessionToken(token);
    if (payload) {
      await prisma.session.deleteMany({ where: { id: payload.sessionId } });
    }
  }
  cookieStore.delete(sessionCookieName);
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName)?.value;
  if (!token) {
    return null;
  }

  const payload = await verifySessionToken(token);
  if (!payload) {
    return null;
  }

  const session = await prisma.session.findFirst({
    where: {
      id: payload.sessionId,
      userId: payload.userId,
      expiresAt: { gt: new Date() },
    },
    include: { user: true },
  });

  if (!session) {
    return null;
  }

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    role: session.user.role,
    avatar: session.user.avatar,
    emailVerified: session.user.emailVerified,
  };
}
