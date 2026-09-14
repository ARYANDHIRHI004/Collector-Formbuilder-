import type * as trpcExpress from "@trpc/server/adapters/express";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

export interface AuthSession {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
}

export interface Context {
  db: unknown;
  session: AuthSession | null;
  user: AuthUser | null;
}

export type CreateContextFn = (
  opts: trpcExpress.CreateExpressContextOptions,
) => Promise<Context>;
