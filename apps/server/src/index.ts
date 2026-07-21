import { devToolsMiddleware } from "@ai-sdk/devtools";
import { google } from "@ai-sdk/google";
import { env } from "@all-chat/env/server";
import {
  pipeUIMessageStreamToResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
  convertToModelMessages,
  wrapLanguageModel,
} from "ai";
import cors from "cors";
import express from "express";

import { Server } from "socket.io";

import { createServer } from "http";

import { app } from "./app";

import "./user";
import "./room";
import { db } from "@all-chat/db";
import { room } from "@all-chat/db/schema/room";
import { eq } from "drizzle-orm";

const httpServer = createServer(app);

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    methods: ["GET", "POST", "OPTIONS"],
  }),
);

app.use(express.json());

app.post("/ai", async (req, res) => {
  const { messages = [] } = (req.body || {}) as { messages: UIMessage[] };
  const model = wrapLanguageModel({
    model: google("gemini-2.5-flash"),
    middleware: devToolsMiddleware(),
  });
  const result = streamText({
    model,
    messages: await convertToModelMessages(messages),
  });
  pipeUIMessageStreamToResponse({
    response: res,
    stream: toUIMessageStream({ stream: result.stream }),
  });
});

app.get("/", (_req, res) => {
  res.status(200).send("OK");
});

// const app = express();

const io = new Server(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] }, // loosen for local testing
});

io.on("connection", (socket) => {
  // 1) join a room (keyed by room name so it matches what the client sends)
  socket.on("join-room", async (room_id) => {
    const requestedRoom = await db
      .select()
      .from(room)
      .where(eq(room.id, room_id));

    if (!requestedRoom?.[0]) {
      socket.emit("room-error", "room does not exist");
      return;
    }

    socket.join(room_id);
    socket.emit("joined-room", room_id);
    console.log(`${socket.id} joined ${room_id}`);
  });

  // 1b) leave a room (client emits this when switching away / unmounting)
  socket.on("leave-room", (room_id) => {
    if (!room_id) return;
    socket.leave(room_id);
    console.log(`${socket.id} left ${room_id}`);
  });

  // 2) send text to the other members of that room
  socket.on("message", ({ room_id, text }) => {
    console.log("AdaidhFIOJFB");
    console.log(room_id, text);

    if (!room_id || !text) return;
    // socket.to(...) excludes the sender; the sender adds its own message
    // optimistically on the client, so this avoids a duplicate echo.
    console.log(text);
    // const a = socket.join(room_id);
    // console.log(a);

    socket.to(room_id).emit("message", {
      text,
      at: Date.now(),
    });
  });
});

httpServer.listen(8000, () => {
  console.log("Server is running on http://localhost:8000");
});
