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

  console.log("sfsf",socket.id);
  
  // 1) join a room
  socket.on("join-room", async (room_name) => {
    const requestedRoom = await db
      .select()
      .from(room)
      .where(eq(room.room_name, room_name));

    console.log(requestedRoom);
    const roomId = requestedRoom?.[0]?.id;

    console.log(roomId);
    
    if (!roomId) {
      console.log("Adadasd");
      
      socket._error("room does not exist");
    }

    socket.join(roomId);
    console.log(`${socket.id} joined ${roomId}`);
  });

  // 2) send text to everyone in that room
  socket.on("message", ({ roomId, text }) => {
    io.to(roomId).emit("message", text); // fan out to all members of roomId
  });
});

httpServer.listen(8000, () => {
  console.log("Server is running on http://localhost:8000");
});
