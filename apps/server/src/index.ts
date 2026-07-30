import express from 'express'
import { env } from './config/env.js';
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from './app.js';
import { createContext } from "@workspace/trpc";

const app = express();

const PORT = +(env.PORT ?? 4000);

app.use(express.json());
app.use(express.urlencoded());

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

app.listen(PORT, () => {
    console.log(`Server is listening at port ${PORT}`);
})

