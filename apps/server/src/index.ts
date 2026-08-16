import express from 'express'
import { env } from './config/env.js';
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from './config/trpc.js';
import { createContext } from "@workspace/trpc";
import { toNodeHandler } from 'better-auth/node';
import auth from './config/db.js';
import cors from 'cors'

const app = express();



const PORT = +(env.PORT ?? 4000);
app.use(cors({
    origin: ["http://localhost:3000", "*"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.post("/api/auth/{*any}", toNodeHandler(auth));
app.get("/api/auth/{*any}", toNodeHandler(auth));

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

