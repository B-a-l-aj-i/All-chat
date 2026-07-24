import { app } from "./app";
import { db } from "@all-chat/db";
import { chats } from "@all-chat/db/schema/chats";
import { room } from "@all-chat/db/schema/room";
import { roomMembers } from "@all-chat/db/schema/roomMembers";
import { user } from "@all-chat/db/schema/user";
import { and, asc, eq } from "drizzle-orm";
import { getChatsHandler, sendChatHandler } from "./chatHandlers";
import { sendChatLimiter } from "./limits";

const accessDeps = {
  async findUser(userId: string) {
    const rows = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);
    return rows[0] ?? null;
  },
  async findRoom(roomId: string) {
    const rows = await db
      .select({ id: room.id, owner_id: room.owner_id })
      .from(room)
      .where(eq(room.id, roomId))
      .limit(1);
    return rows[0] ?? null;
  },
  async findRoomMember(roomId: string, userId: string) {
    const rows = await db
      .select({ room_id: roomMembers.room_id, user_id: roomMembers.user_id })
      .from(roomMembers)
      .where(and(eq(roomMembers.room_id, roomId), eq(roomMembers.user_id, userId)))
      .limit(1);
    return rows[0] ?? null;
  },
};

app.get(
  "/chats",
  getChatsHandler({
    ...accessDeps,
    async listChats(roomId) {
      return db
        .select({
          id: chats.id,
          room_id: chats.room_id,
          user_id: chats.user_id,
          username: user.username,
          text: chats.text,
          created_at: chats.created_at,
        })
        .from(chats)
        .innerJoin(user, eq(user.id, chats.user_id))
        .where(eq(chats.room_id, roomId))
        .orderBy(asc(chats.created_at));
    },
  }),
);

app.post(
  "/chats",
  sendChatLimiter,
  sendChatHandler({
    ...accessDeps,
    async createChat(input) {
      const rows = await db.insert(chats).values(input).returning();
      return rows[0]!;
    },
  }),
);
