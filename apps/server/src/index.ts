import { env } from "@all-chat/env/server";

import { Server } from "socket.io";

import { createServer } from "http";

import { app } from "./app";

import "./user";
import "./room";
import "./chat";
import { db } from "@all-chat/db";
import { room } from "@all-chat/db/schema/room";
import { roomMembers } from "@all-chat/db/schema/roomMembers";
import { user } from "@all-chat/db/schema/user";
import { and, eq } from "drizzle-orm";
import { createSocketHandlers } from "./socketHandlers";

const httpServer = createServer(app);

app.get("/", (_req, res) => {
  res.status(200).send("OK");
});

// const app = express();

const io = new Server(httpServer, {
  cors: { origin: env.CORS_ORIGIN, methods: ["GET", "POST"] },
});

const socketHandlers = createSocketHandlers({
  async findUser(userId) {
    const rows = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);
    return rows[0] ?? null;
  },
  async findRoom(roomId) {
    const rows = await db
      .select({ id: room.id, owner_id: room.owner_id })
      .from(room)
      .where(eq(room.id, roomId))
      .limit(1);
    return rows[0] ?? null;
  },
  async findRoomMember(roomId, userId) {
    const rows = await db
      .select({ room_id: roomMembers.room_id, user_id: roomMembers.user_id })
      .from(roomMembers)
      .where(and(eq(roomMembers.room_id, roomId), eq(roomMembers.user_id, userId)))
      .limit(1);
    return rows[0] ?? null;
  },
});

io.on("connection", (socket) => {
  socket.on("join-room", (payload) => socketHandlers.joinRoom(socket, payload));
  socket.on("leave-room", (roomId) => socketHandlers.leaveRoom(socket, roomId));
  socket.on("message", (payload) => socketHandlers.message(socket, payload));
});

httpServer.listen(8000, () => {
  console.log("Server is running on http://localhost:8000");
});
