export type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
};

export type RateLimitKey = {
  scope: string;
  identifier: string;
};

export type RateLimitStore = {
  increment: (key: string, windowMs: number) => Promise<{ count: number; resetAt: number }>;
};
