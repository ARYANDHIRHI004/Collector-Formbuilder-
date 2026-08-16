import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import type { NodePgDatabase } from "drizzle-orm/node-postgres"
import {schema} from "@workspace/db"

interface CreateAuthOptions {
  db: NodePgDatabase
  baseURL: string
  secret: string
  GOOGLE_CLIENT_ID: string
  GOOGLE_CLIENT_SECRET: string
  
}

// console.log(schema)

export function createAuth({ db, baseURL, secret, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET  }: CreateAuthOptions) {
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg", // or "mysql", "sqlite"
      schema: schema,

    }),

    baseURL,

    secret,
    trustedOrigins: ["http://localhost:3000"],


    socialProviders: {
      google: {
        clientId: GOOGLE_CLIENT_ID as string,
        clientSecret: GOOGLE_CLIENT_SECRET as string,
      },

    },
  })
}
