import type { User, UserProfile } from "@prisma/client";

export function profileCompletion(user: User, profile: UserProfile | null): number {
  const checks = [
    Boolean(user.name),
    Boolean(user.emailVerified),
    Boolean(profile?.phone),
    Boolean(profile?.dateOfBirth),
    Boolean(profile?.gender),
    Boolean(profile?.height),
    Boolean(profile?.weight),
    Boolean(profile?.preferredLanguage),
    Boolean(profile?.bodyType),
    Boolean(profile?.skinTone),
  ];
  const completed = checks.filter(Boolean).length;
  return Math.round((completed / checks.length) * 100);
}
