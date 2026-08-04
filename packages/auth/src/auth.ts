import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import type { NodePgDatabase } from "drizzle-orm/node-postgres"

interface CreateAuthOptions {
  db: NodePgDatabase
  baseURL: string
  secret: string
}

export function createAuth({ db, baseURL, secret }: CreateAuthOptions) {
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg", // or "mysql", "sqlite"
    }),

    baseURL,

    secret,

    emailAndPassword: {
      enabled: true,
    },
  })
}
