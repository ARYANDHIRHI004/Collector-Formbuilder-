import { router } from "@workspace/trpc";
import { formRouter } from "../modules/form/form.router.js";
import { submissionRouter } from "../modules/submission/submission.router.js";

export const appRouter = router({
  form: formRouter,
  submission: submissionRouter,
});

export type AppRouter = typeof appRouter;
