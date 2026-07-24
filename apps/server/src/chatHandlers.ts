import { requireRoomAccess, requireUserExists } from "./access";
import { parseInput, sendError, sendSuccess } from "./http";
import { getChatsQuerySchema, sendChatBodySchema } from "./schemas";

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

interface ChatMessage {
  id: string;
  room_id: string;
  user_id: string;
  username?: string;
  text: string;
  created_at: Date;
}

interface RequestLike {
  body?: unknown;
  query?: unknown;
}

interface ResponseLike {
  status(code: number): ResponseLike;
  json(body: unknown): ResponseLike;
}

interface AccessDeps {
  findUser(userId: string): Promise<UserRef | null>;
  findRoom(roomId: string): Promise<RoomRef | null>;
  findRoomMember(roomId: string, userId: string): Promise<RoomMemberRef | null>;
}

interface GetChatsDeps extends AccessDeps {
  listChats(roomId: string): Promise<ChatMessage[]>;
}

interface SendChatDeps extends AccessDeps {
  createChat(input: {
    room_id: string;
    user_id: string;
    text: string;
  }): Promise<ChatMessage>;
}

export function getChatsHandler(deps: GetChatsDeps) {
  return async (req: RequestLike, res: ResponseLike) => {
    const parsed = parseInput(getChatsQuerySchema, req.query);
    if (!parsed.ok) {
      return sendError(res, parsed.status, parsed.error.code, parsed.error.message);
    }

    const access = await ensureRoomAccess(parsed.data.room_id, parsed.data.user_id, deps);
    if (!access.ok) {
      return sendError(res, access.status, access.error.code, access.error.message);
    }

    try {
      const messages = await deps.listChats(parsed.data.room_id);
      return sendSuccess(res, messages);
    } catch (error) {
      console.log(error);
      return sendError(res, 500, "CHAT_FETCH_FAILED", "Database fetch failed.");
    }
  };
}

export function sendChatHandler(deps: SendChatDeps) {
  return async (req: RequestLike, res: ResponseLike) => {
    const parsed = parseInput(sendChatBodySchema, req.body);
    if (!parsed.ok) {
      return sendError(res, parsed.status, parsed.error.code, parsed.error.message);
    }

    const access = await ensureRoomAccess(parsed.data.room_id, parsed.data.user_id, deps);
    if (!access.ok) {
      return sendError(res, access.status, access.error.code, access.error.message);
    }

    try {
      const inserted = await deps.createChat(parsed.data);
      return sendSuccess(res, inserted, 201);
    } catch (error) {
      console.log(error);
      return sendError(res, 400, "CHAT_CREATE_FAILED", "Could not save message.");
    }
  };
}

async function ensureRoomAccess(roomId: string, userId: string, deps: AccessDeps) {
  const existingUser = await requireUserExists(userId, deps);
  if (!existingUser.ok) {
    return existingUser;
  }

  return requireRoomAccess(roomId, userId, deps);
}
