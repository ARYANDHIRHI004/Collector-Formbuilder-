import { z } from "zod";
import dotenv from "dotenv";

dotenv.config({
  path: ".env",
});

function validateEnvironment(env: NodeJS.ProcessEnv) {
  const environment = z.object({
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    PORT: z.coerce.number().default(4000),
    DATABASE_URL: z.string(),
    BETTER_AUTH_URL: z.string(),
    BETTER_AUTH_SECRET: z.string().min(32),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
  });

  return environment.parse(env);
}

export const env = validateEnvironment(process.env);
