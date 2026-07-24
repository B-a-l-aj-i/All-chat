import { parseInput, sendError, sendSuccess } from "./http";
import { createUserBodySchema } from "./schemas";

interface UserRow {
  id: string;
  username: string;
  password: string;
  is_anonymous: boolean;
}

interface RequestLike {
  body?: unknown;
}

interface ResponseLike {
  status(code: number): ResponseLike;
  json(body: unknown): ResponseLike;
}

interface CreateUserDeps {
  createUser(input: {
    username: string;
    password: string;
  }): Promise<UserRow>;
}

interface CreateLocalUserDeps {
  createLocalUser(): Promise<UserRow>;
}

export function createUserHandler(deps: CreateUserDeps) {
  return async (req: RequestLike, res: ResponseLike) => {
    const parsed = parseInput(createUserBodySchema, req.body);
    if (!parsed.ok) {
      return sendError(res, parsed.status, parsed.error.code, parsed.error.message);
    }

    try {
      const created = await deps.createUser(parsed.data);
      return sendSuccess(res, toUserDto(created), 201);
    } catch (error) {
      console.log(error);
      return sendError(res, 400, "USER_CREATE_FAILED", "Could not create user.");
    }
  };
}

export function createLocalUserHandler(deps: CreateLocalUserDeps) {
  return async (_req: RequestLike, res: ResponseLike) => {
    try {
      const created = await deps.createLocalUser();
      return sendSuccess(res, toUserDto(created), 201);
    } catch (error) {
      console.log(error);
      return sendError(res, 400, "USER_CREATE_FAILED", "Could not create user.");
    }
  };
}

export async function disabledUsersHandler(_req: RequestLike, res: ResponseLike) {
  return sendError(res, 404, "NOT_FOUND", "Endpoint not found.");
}

function toUserDto(user: UserRow) {
  return {
    id: user.id,
    username: user.username,
    is_anonymous: user.is_anonymous,
  };
}
