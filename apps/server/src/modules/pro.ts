import {publicProcedure, router} from "@workspace/trpc"
import { undefined } from "zod";
import { string } from "zod/mini";

export const proRouter = router({
  createTodo: publicProcedure
    .input(undefined())
    .output(string())
    .query(({input}) => {
      return "hello";
    }),
});