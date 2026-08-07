import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { schema } from "./index.js";

export function createDb(connectionString: string) {
  const client = postgres(connectionString);

  return drizzle(client, {
    schema
  });
}