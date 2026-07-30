// routers/index.ts

import {router} from "@workspace/trpc";
import { proRouter } from "./modules/pro.js";

// import { formRouter } from "./form.router";
// import { submissionRouter } from "./submission.router";

export const appRouter = router({
    form: proRouter,
    // submission: submissionRouter,
});

export type AppRouter = typeof appRouter;