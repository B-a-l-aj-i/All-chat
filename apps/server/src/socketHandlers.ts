import { requireRoomAccess, requireUserExists } from "./access";
import { parseInput } from "./http";
import { sendChatBodySchema, socketRoomPayloadSchema } from "./schemas";

interface UserRef {
  id: string;
}

interface RoomRef {
  id: string;
  owner_id: string | null;
}

interface RoomMemberRef {
  room_id: string;
  user_id: string;
}

interface SocketLike {
  join(roomId: string): void;
  leave(roomId: string): void;
  emit(event: string, payload: unknown): void;
  to(roomId: string): { emit(event: string, payload: unknown): void };
}

interface SocketDeps {
  findUser(userId: string): Promise<UserRef | null>;
  findRoom(roomId: string): Promise<RoomRef | null>;
  findRoomMember(roomId: string, userId: string): Promise<RoomMemberRef | null>;
}

export function createSocketHandlers(deps: SocketDeps) {
  return {
    async joinRoom(socket: SocketLike, payload: unknown) {
      const parsed = parseInput(socketRoomPayloadSchema, payload);
      if (!parsed.ok) {
        emitRoomError(socket, "VALIDATION_ERROR", "Invalid room payload.");
        return;
      }

      const access = await ensureRoomAccess(parsed.data.room_id, parsed.data.user_id, deps);
      if (!access.ok) {
        emitRoomError(socket, access.error.code, access.error.message);
        return;
      }

      socket.join(parsed.data.room_id);
      socket.emit("joined-room", parsed.data.room_id);
    },

    leaveRoom(socket: SocketLike, roomId: unknown) {
      if (typeof roomId !== "string" || !roomId.trim()) {
        return;
      }

      socket.leave(roomId);
    },

    async message(socket: SocketLike, payload: unknown) {
      const parsed = parseInput(sendChatBodySchema, payload);
      if (!parsed.ok) {
        emitRoomError(socket, "VALIDATION_ERROR", "Invalid message payload.");
        return;
      }

      const access = await ensureRoomAccess(parsed.data.room_id, parsed.data.user_id, deps);
      if (!access.ok) {
        emitRoomError(socket, access.error.code, access.error.message);
        return;
      }

      socket.to(parsed.data.room_id).emit("message", {
        at: Date.now(),
      });
    },
  };
}

async function ensureRoomAccess(roomId: string, userId: string, deps: SocketDeps) {
  const existingUser = await requireUserExists(userId, deps);
  if (!existingUser.ok) {
    return existingUser;
  }

  return requireRoomAccess(roomId, userId, deps);
}

function emitRoomError(socket: SocketLike, code: string, message: string) {
  socket.emit("room-error", { error: { code, message } });
}
