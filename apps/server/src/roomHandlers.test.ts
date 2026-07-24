import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createRoomHandler, joinRoomHandler, myRoomsHandler } from "./roomHandlers";

class FakeResponse {
  statusCode = 200;
  body: unknown;

  status(code: number) {
    this.statusCode = code;
    return this;
  }

  json(body: unknown) {
    this.body = body;
    return this;
  }
}

describe("room handlers", () => {
  it("rejects my-rooms requests for missing users", async () => {
    const res = new FakeResponse();
    const handler = myRoomsHandler({
      findUser: async () => null,
      listRoomsForUser: async () => [],
    });

    await handler({ query: { userId: "missing" } }, res);

    assert.equal(res.statusCode, 404);
    assert.deepEqual((res.body as { error: { code: string } }).error.code, "USER_NOT_FOUND");
  });

  it("returns only safe room fields for my rooms", async () => {
    const res = new FakeResponse();
    const handler = myRoomsHandler({
      findUser: async () => ({ id: "user_1" }),
      listRoomsForUser: async () => [
        {
          id: "room_1",
          room_name: "general",
          description: "Team chat",
          password: "secret",
          owner_id: "user_1",
        },
      ],
    });

    await handler({ query: { userId: "user_1" } }, res);

    assert.deepEqual(res.body, {
      data: [
        {
          id: "room_1",
          room_name: "general",
          description: "Team chat",
          owner_id: "user_1",
        },
      ],
    });
  });

  it("stops create-room when the room already exists", async () => {
    let created = false;
    const res = new FakeResponse();
    const handler = createRoomHandler({
      findUser: async () => ({ id: "user_1" }),
      findRoomByName: async () => ({ id: "room_1" }),
      createRoom: async () => {
        created = true;
        throw new Error("should not create");
      },
      addRoomMember: async () => {},
    });

    await handler(
      {
        body: {
          room_name: "general",
          description: "",
          password: "secret",
          owner_id: "user_1",
        },
      },
      res,
    );

    assert.equal(created, false);
    assert.equal(res.statusCode, 409);
    assert.deepEqual((res.body as { error: { code: string } }).error.code, "ROOM_EXISTS");
  });

  it("creates a room and adds the owner as a member", async () => {
    let memberAdded = false;
    const res = new FakeResponse();
    const handler = createRoomHandler({
      findUser: async () => ({ id: "user_1" }),
      findRoomByName: async () => null,
      createRoom: async () => ({
        id: "room_1",
        room_name: "general",
        description: "Team chat",
        password: "secret",
        owner_id: "user_1",
      }),
      addRoomMember: async (roomId, userId) => {
        memberAdded = roomId === "room_1" && userId === "user_1";
      },
    });

    await handler(
      {
        body: {
          room_name: " general ",
          description: " Team chat ",
          password: "secret",
          owner_id: "user_1",
        },
      },
      res,
    );

    assert.equal(memberAdded, true);
    assert.equal(res.statusCode, 201);
    assert.deepEqual(res.body, {
      data: {
        id: "room_1",
        room_name: "general",
        description: "Team chat",
        owner_id: "user_1",
      },
    });
  });

  it("rejects join-room for wrong room password", async () => {
    const res = new FakeResponse();
    const handler = joinRoomHandler({
      findUser: async () => ({ id: "user_1" }),
      findRoomByName: async () => ({
        id: "room_1",
        room_name: "general",
        description: "Team chat",
        password: "secret",
        owner_id: "owner_1",
      }),
      addRoomMember: async () => {},
    });

    await handler(
      { body: { room_name: "general", password: "wrong", user_id: "user_1" } },
      res,
    );

    assert.equal(res.statusCode, 401);
    assert.deepEqual(res.body, {
      error: {
        code: "ROOM_JOIN_FAILED",
        message: "Room name or password is incorrect.",
      },
    });
  });
});
