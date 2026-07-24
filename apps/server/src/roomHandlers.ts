import { requireUserExists } from "./access";
import { parseInput, sendError, sendSuccess } from "./http";
import {
  createRoomBodySchema,
  joinRoomBodySchema,
  myRoomsQuerySchema,
} from "./schemas";

interface UserRef {
  id: string;
}

interface RoomRow {
  id: string;
  room_name: string;
  description: string | null;
  password: string;
  owner_id: string | null;
}

interface RoomRef {
  id: string;
}

interface RequestLike {
  body?: unknown;
  query?: unknown;
}

interface ResponseLike {
  status(code: number): ResponseLike;
  json(body: unknown): ResponseLike;
}

interface MyRoomsDeps {
  findUser(userId: string): Promise<UserRef | null>;
  listRoomsForUser(userId: string): Promise<RoomRow[]>;
}

interface CreateRoomDeps {
  findUser(userId: string): Promise<UserRef | null>;
  findRoomByName(roomName: string): Promise<RoomRef | null>;
  createRoom(input: {
    room_name: string;
    description: string;
    password: string;
    owner_id: string;
  }): Promise<RoomRow>;
  addRoomMember(roomId: string, userId: string): Promise<void>;
}

interface JoinRoomDeps {
  findUser(userId: string): Promise<UserRef | null>;
  findRoomByName(roomName: string): Promise<RoomRow | null>;
  addRoomMember(roomId: string, userId: string): Promise<void>;
}

export function myRoomsHandler(deps: MyRoomsDeps) {
  return async (req: RequestLike, res: ResponseLike) => {
    const parsed = parseInput(myRoomsQuerySchema, req.query);
    if (!parsed.ok) {
      return sendError(res, parsed.status, parsed.error.code, parsed.error.message);
    }

    const existingUser = await requireUserExists(parsed.data.userId, deps);
    if (!existingUser.ok) {
      return sendError(
        res,
        existingUser.status,
        existingUser.error.code,
        existingUser.error.message,
      );
    }

    try {
      const rooms = await deps.listRoomsForUser(parsed.data.userId);
      return sendSuccess(res, rooms.map(toRoomDto));
    } catch (error) {
      console.log(error);
      return sendError(res, 500, "ROOM_FETCH_FAILED", "Database fetch failed.");
    }
  };
}

export function createRoomHandler(deps: CreateRoomDeps) {
  return async (req: RequestLike, res: ResponseLike) => {
    const parsed = parseInput(createRoomBodySchema, req.body);
    if (!parsed.ok) {
      return sendError(res, parsed.status, parsed.error.code, parsed.error.message);
    }

    const existingUser = await requireUserExists(parsed.data.owner_id, deps);
    if (!existingUser.ok) {
      return sendError(
        res,
        existingUser.status,
        existingUser.error.code,
        existingUser.error.message,
      );
    }

    try {
      const existingRoom = await deps.findRoomByName(parsed.data.room_name);
      if (existingRoom) {
        return sendError(res, 409, "ROOM_EXISTS", "Room already exists.");
      }

      const created = await deps.createRoom(parsed.data);
      await deps.addRoomMember(created.id, parsed.data.owner_id);
      return sendSuccess(res, toRoomDto(created), 201);
    } catch (error) {
      console.log(error);
      return sendError(res, 400, "ROOM_CREATE_FAILED", "Could not create room.");
    }
  };
}

export function joinRoomHandler(deps: JoinRoomDeps) {
  return async (req: RequestLike, res: ResponseLike) => {
    const parsed = parseInput(joinRoomBodySchema, req.body);
    if (!parsed.ok) {
      return sendError(res, parsed.status, parsed.error.code, parsed.error.message);
    }

    const existingUser = await requireUserExists(parsed.data.user_id, deps);
    if (!existingUser.ok) {
      return sendError(
        res,
        existingUser.status,
        existingUser.error.code,
        existingUser.error.message,
      );
    }

    try {
      const targetRoom = await deps.findRoomByName(parsed.data.room_name);
      if (!targetRoom || targetRoom.password !== parsed.data.password) {
        return sendError(
          res,
          401,
          "ROOM_JOIN_FAILED",
          "Room name or password is incorrect.",
        );
      }

      await deps.addRoomMember(targetRoom.id, parsed.data.user_id);
      return sendSuccess(res, toRoomDto(targetRoom));
    } catch (error) {
      console.log(error);
      return sendError(res, 400, "ROOM_JOIN_FAILED", "Could not join room.");
    }
  };
}

function toRoomDto(room: RoomRow) {
  return {
    id: room.id,
    room_name: room.room_name,
    description: room.description,
    owner_id: room.owner_id,
  };
}
