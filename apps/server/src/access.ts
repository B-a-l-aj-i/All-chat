import { and, eq } from "drizzle-orm";
import type { ParseResult } from "./http";

interface ExistingUser {
  id: string;
}

interface ExistingRoom {
  id: string;
  owner_id: string | null;
}

interface ExistingRoomMember {
  room_id: string;
  user_id: string;
}

interface UserDeps {
  findUser(userId: string): Promise<ExistingUser | null>;
}

interface RoomAccessDeps {
  findRoom(roomId: string): Promise<ExistingRoom | null>;
  findRoomMember(roomId: string, userId: string): Promise<ExistingRoomMember | null>;
}

type RoomRole = "owner" | "member";

export async function requireUserExists(
  userId: string,
  deps: UserDeps = defaultUserDeps,
): Promise<ParseResult<ExistingUser>> {
  const existingUser = await deps.findUser(userId);

  if (!existingUser) {
    return {
      ok: false,
      status: 404,
      error: {
        code: "USER_NOT_FOUND",
        message: "User does not exist.",
      },
    };
  }

  return { ok: true, data: existingUser };
}

export async function requireRoomAccess(
  roomId: string,
  userId: string,
  deps: RoomAccessDeps = defaultRoomAccessDeps,
): Promise<ParseResult<{ room: ExistingRoom; role: RoomRole }>> {
  const existingRoom = await deps.findRoom(roomId);

  if (!existingRoom) {
    return {
      ok: false,
      status: 404,
      error: {
        code: "ROOM_NOT_FOUND",
        message: "Room does not exist.",
      },
    };
  }

  if (existingRoom.owner_id === userId) {
    return { ok: true, data: { room: existingRoom, role: "owner" } };
  }

  const membership = await deps.findRoomMember(roomId, userId);
  if (membership) {
    return { ok: true, data: { room: existingRoom, role: "member" } };
  }

  return {
    ok: false,
    status: 403,
    error: {
      code: "ROOM_FORBIDDEN",
      message: "You are not a member of this room.",
    },
  };
}

const defaultUserDeps: UserDeps = {
  async findUser(userId) {
    const { db } = await import("@all-chat/db");
    const { user } = await import("@all-chat/db/schema/user");
    const rows = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    return rows[0] ?? null;
  },
};

const defaultRoomAccessDeps: RoomAccessDeps = {
  async findRoom(roomId) {
    const { db } = await import("@all-chat/db");
    const { room } = await import("@all-chat/db/schema/room");
    const rows = await db
      .select({ id: room.id, owner_id: room.owner_id })
      .from(room)
      .where(eq(room.id, roomId))
      .limit(1);

    return rows[0] ?? null;
  },
  async findRoomMember(roomId, userId) {
    const { db } = await import("@all-chat/db");
    const { roomMembers } = await import("@all-chat/db/schema/roomMembers");
    const rows = await db
      .select({ room_id: roomMembers.room_id, user_id: roomMembers.user_id })
      .from(roomMembers)
      .where(and(eq(roomMembers.room_id, roomId), eq(roomMembers.user_id, userId)))
      .limit(1);

    return rows[0] ?? null;
  },
};
