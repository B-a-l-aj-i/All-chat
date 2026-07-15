import { env } from "@all-chat/env/server";
import cors from "cors";
import express, { type Express } from "express";

export const app: Express = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    methods: ["GET", "POST", "OPTIONS"],
  }),
);

app.use(express.json());
