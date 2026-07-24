import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  aiBodySchema,
  createRoomBodySchema,
  getChatsQuerySchema,
  joinRoomBodySchema,
  myRoomsQuerySchema,
  sendChatBodySchema,
} from "./schemas";

describe("route schemas", () => {
  it("trims and validates create-room bodies", () => {
    const result = createRoomBodySchema.parse({
      room_name: "  general  ",
      description: "  Team chat  ",
      password: "secret",
      owner_id: "user_1",
    });

    assert.deepEqual(result, {
      room_name: "general",
      description: "Team chat",
      password: "secret",
      owner_id: "user_1",
    });
  });

  it("rejects empty room names", () => {
    assert.throws(
      () =>
        createRoomBodySchema.parse({
          room_name: "",
          description: "",
          password: "secret",
          owner_id: "user_1",
        }),
      /room_name/i,
    );
  });

  it("validates join-room bodies", () => {
    const result = joinRoomBodySchema.parse({
      room_name: "  general  ",
      password: "secret",
      user_id: "user_1",
    });

    assert.deepEqual(result, {
      room_name: "general",
      password: "secret",
      user_id: "user_1",
    });
  });

  it("requires user identity for chat reads", () => {
    assert.throws(() => getChatsQuerySchema.parse({ room_id: "room_1" }), /user_id/i);
    assert.deepEqual(getChatsQuerySchema.parse({ room_id: "room_1", user_id: "user_1" }), {
      room_id: "room_1",
      user_id: "user_1",
    });
  });

  it("validates chat writes with bounded text", () => {
    assert.deepEqual(
      sendChatBodySchema.parse({
        room_id: "room_1",
        user_id: "user_1",
        text: "  hello  ",
      }),
      { room_id: "room_1", user_id: "user_1", text: "hello" },
    );

    assert.throws(
      () =>
        sendChatBodySchema.parse({
          room_id: "room_1",
          user_id: "user_1",
          text: "x".repeat(2001),
        }),
      /text/i,
    );
  });

  it("validates room-list query identity", () => {
    assert.deepEqual(myRoomsQuerySchema.parse({ userId: "user_1" }), {
      userId: "user_1",
    });
  });

  it("limits AI message count", () => {
    assert.deepEqual(aiBodySchema.parse({}), { messages: [] });
    assert.throws(
      () => aiBodySchema.parse({ messages: Array.from({ length: 21 }, () => ({})) }),
      /messages/i,
    );
  });
});
