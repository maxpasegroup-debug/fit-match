import type { UserRole } from "@prisma/client";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string | null;
  emailVerified: Date | null;
};

export type SessionPayload = {
  sessionId: string;
  userId: string;
};
