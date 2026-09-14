import { createAuthClient } from "better-auth/react";

const apiBaseUrl =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : "http://localhost:8000";

export const authClient = createAuthClient({
  baseURL: apiBaseUrl,
});