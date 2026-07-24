import { app } from "./app";
import { db } from "@all-chat/db";
import { room } from "@all-chat/db/schema/room";
import { roomMembers } from "@all-chat/db/schema/roomMembers";
import { user } from "@all-chat/db/schema/user";
import { eq, inArray, or } from "drizzle-orm";
import {
  createRoomHandler,
  joinRoomHandler,
  myRoomsHandler,
} from "./roomHandlers";
import { joinRoomLimiter } from "./limits";

app.get(
  "/my-rooms",
  myRoomsHandler({
    async findUser(userId) {
      const rows = await db
        .select({ id: user.id })
        .from(user)
        .where(eq(user.id, userId))
        .limit(1);
      return rows[0] ?? null;
    },
    async listRoomsForUser(userId) {
      return db
        .select()
        .from(room)
        .where(
          or(
            eq(room.owner_id, userId),
            inArray(
              room.id,
              db
                .select({ id: roomMembers.room_id })
                .from(roomMembers)
                .where(eq(roomMembers.user_id, userId)),
            ),
          ),
        );
    },
  }),
);

app.post(
  "/create-room",
  createRoomHandler({
    async findUser(userId) {
      const rows = await db
        .select({ id: user.id })
        .from(user)
        .where(eq(user.id, userId))
        .limit(1);
      return rows[0] ?? null;
    },
    async findRoomByName(roomName) {
      const rows = await db
        .select({ id: room.id })
        .from(room)
        .where(eq(room.room_name, roomName))
        .limit(1);
      return rows[0] ?? null;
    },
    async createRoom(input) {
      const rows = await db.insert(room).values(input).returning();
      return rows[0]!;
    },
    async addRoomMember(roomId, userId) {
      await db
        .insert(roomMembers)
        .values({ room_id: roomId, user_id: userId })
        .onConflictDoNothing();
    },
  }),
);

app.post(
  "/join-room",
  joinRoomLimiter,
  joinRoomHandler({
    async findUser(userId) {
      const rows = await db
        .select({ id: user.id })
        .from(user)
        .where(eq(user.id, userId))
        .limit(1);
      return rows[0] ?? null;
    },
    async findRoomByName(roomName) {
      const rows = await db
        .select()
        .from(room)
        .where(eq(room.room_name, roomName))
        .limit(1);
      return rows[0] ?? null;
    },
    async addRoomMember(roomId, userId) {
      await db
        .insert(roomMembers)
        .values({ room_id: roomId, user_id: userId })
        .onConflictDoNothing();
    },
  }),
);
