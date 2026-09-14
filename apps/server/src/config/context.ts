import { fromNodeHeaders } from "better-auth/node";
import type { CreateContextFn } from "@workspace/trpc";
import auth, { db } from "./db.js";

export const createContext: CreateContextFn = async ({ req }) => {
  console.log("COOKIE:", req.headers.cookie);
  const sessionData = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  console.log("aryan", auth.api.getSession);
  


  return {
    db,
    session: sessionData?.session ?? null,
    user: sessionData?.user ?? null,
  };
};
