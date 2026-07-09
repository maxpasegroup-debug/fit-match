export const sessionDurations = {
  standard: 60 * 60 * 24 * 30,
  rememberMe: 60 * 60 * 24 * 90,
} as const;

export type CreateSessionOptions = {
  rememberMe?: boolean;
};
