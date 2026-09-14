import { createDb } from "@workspace/db";
import { env } from "./env.js";
import { createAuth } from "@workspace/auth/server";

export const db = createDb(env.DATABASE_URL);

const auth = createAuth({
  db,
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  GOOGLE_CLIENT_ID: env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: env.GOOGLE_CLIENT_SECRET,
});

export default auth;
