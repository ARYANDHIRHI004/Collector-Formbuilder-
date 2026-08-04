import { createDb } from "@workspace/db";
import { env } from "./env.js";
import { createAuth } from "@workspace/auth";

const db = createDb(env.DATABASE_URL!);

const auth = createAuth({
  db,
  baseURL: process.env.AUTH_BASE_URL!,
  secret: process.env.AUTH_SECRET!,
});

export default auth