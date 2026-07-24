import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createSocketHandlers } from "./socketHandlers";

class FakeSocket {
  joined: string[] = [];
  left: string[] = [];
  emitted: Array<[string, unknown]> = [];
  broadcasts: Array<[string, string, unknown]> = [];

  join(roomId: string) {
    this.joined.push(roomId);
  }

  leave(roomId: string) {
    this.left.push(roomId);
  }

  emit(event: string, payload: unknown) {
    this.emitted.push([event, payload]);
  }

  to(roomId: string) {
    return {
      emit: (event: string, payload: unknown) => {
        this.broadcasts.push([roomId, event, payload]);
      },
    };
  }
}

const allowedDeps = {
  findUser: async () => ({ id: "user_1" }),
  findRoom: async () => ({ id: "room_1", owner_id: "owner_1" }),
  findRoomMember: async () => ({ room_id: "room_1", user_id: "user_1" }),
};

describe("socket handlers", () => {
  it("rejects invalid join payloads", async () => {
    const socket = new FakeSocket();
    const handlers = createSocketHandlers(allowedDeps);

    await handlers.joinRoom(socket, "room_1");

    assert.deepEqual(socket.joined, []);
    assert.deepEqual(socket.emitted[0], [
      "room-error",
      { error: { code: "VALIDATION_ERROR", message: "Invalid room payload." } },
    ]);
  });

  it("joins rooms only after access is allowed", async () => {
    const socket = new FakeSocket();
    const handlers = createSocketHandlers(allowedDeps);

    await handlers.joinRoom(socket, { room_id: "room_1", user_id: "user_1" });

    assert.deepEqual(socket.joined, ["room_1"]);
    assert.deepEqual(socket.emitted[0], ["joined-room", "room_1"]);
  });

  it("rejects room messages from non-members", async () => {
    const socket = new FakeSocket();
    const handlers = createSocketHandlers({
      findUser: async () => ({ id: "user_1" }),
      findRoom: async () => ({ id: "room_1", owner_id: "owner_1" }),
      findRoomMember: async () => null,
    });

    await handlers.message(socket, {
      room_id: "room_1",
      user_id: "user_1",
      text: "hello",
    });

    assert.deepEqual(socket.broadcasts, []);
    assert.deepEqual(socket.emitted[0], [
      "room-error",
      { error: { code: "ROOM_FORBIDDEN", message: "You are not a member of this room." } },
    ]);
  });

  it("broadcasts room messages after access is allowed", async () => {
    const socket = new FakeSocket();
    const handlers = createSocketHandlers(allowedDeps);

    await handlers.message(socket, {
      room_id: "room_1",
      user_id: "user_1",
      text: "hello",
    });

    assert.equal(socket.broadcasts.length, 1);
    assert.equal(socket.broadcasts[0]?.[0], "room_1");
    assert.equal(socket.broadcasts[0]?.[1], "message");
  });
});
