import { createDb } from "@workspace/db";
import { env } from "./env.js";
import { createAuth } from "@workspace/auth/server";

export const db = createDb(env.DATABASE_URL!);

console.log(env.BETTER_AUTH_URL)

const auth = createAuth({
  db,
  baseURL: env.BETTER_AUTH_URL!,
  secret: process.env.AUTH_SECRET!,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
  
});

export default auth