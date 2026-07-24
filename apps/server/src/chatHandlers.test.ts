import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getChatsHandler, sendChatHandler } from "./chatHandlers";

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

const allowedDeps = {
  findUser: async () => ({ id: "user_1" }),
  findRoom: async () => ({ id: "room_1", owner_id: "owner_1" }),
  findRoomMember: async () => ({ room_id: "room_1", user_id: "user_1" }),
};

describe("chat handlers", () => {
  it("rejects chat reads without user identity", async () => {
    const res = new FakeResponse();
    const handler = getChatsHandler({
      ...allowedDeps,
      listChats: async () => [],
    });

    await handler({ query: { room_id: "room_1" } }, res);

    assert.equal(res.statusCode, 400);
    assert.deepEqual((res.body as { error: { code: string } }).error.code, "VALIDATION_ERROR");
  });

  it("rejects chat reads for non-members", async () => {
    const res = new FakeResponse();
    const handler = getChatsHandler({
      findUser: async () => ({ id: "user_1" }),
      findRoom: async () => ({ id: "room_1", owner_id: "owner_1" }),
      findRoomMember: async () => null,
      listChats: async () => [],
    });

    await handler({ query: { room_id: "room_1", user_id: "user_1" } }, res);

    assert.equal(res.statusCode, 403);
    assert.deepEqual((res.body as { error: { code: string } }).error.code, "ROOM_FORBIDDEN");
  });

  it("returns messages for members", async () => {
    const res = new FakeResponse();
    const handler = getChatsHandler({
      ...allowedDeps,
      listChats: async () => [
        {
          id: "chat_1",
          room_id: "room_1",
          user_id: "user_1",
          username: "ada",
          text: "hello",
          created_at: new Date("2026-07-24T00:00:00.000Z"),
        },
      ],
    });

    await handler({ query: { room_id: "room_1", user_id: "user_1" } }, res);

    assert.deepEqual(res.body, {
      data: [
        {
          id: "chat_1",
          room_id: "room_1",
          user_id: "user_1",
          username: "ada",
          text: "hello",
          created_at: new Date("2026-07-24T00:00:00.000Z"),
        },
      ],
    });
  });

  it("validates and authorizes chat writes before insert", async () => {
    let inserted = false;
    const res = new FakeResponse();
    const handler = sendChatHandler({
      ...allowedDeps,
      createChat: async () => {
        inserted = true;
        return {
          id: "chat_1",
          room_id: "room_1",
          user_id: "user_1",
          text: "hello",
          created_at: new Date("2026-07-24T00:00:00.000Z"),
        };
      },
    });

    await handler(
      { body: { room_id: "room_1", user_id: "user_1", text: " hello " } },
      res,
    );

    assert.equal(inserted, true);
    assert.equal(res.statusCode, 201);
    assert.deepEqual((res.body as { data: { text: string } }).data.text, "hello");
  });
});
