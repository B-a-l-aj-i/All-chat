import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { requireRoomAccess, requireUserExists } from "./access";

describe("access helpers", () => {
  it("accepts an existing user", async () => {
    const result = await requireUserExists("user_1", {
      findUser: async () => ({ id: "user_1" }),
    });

    assert.deepEqual(result, { ok: true, data: { id: "user_1" } });
  });

  it("rejects a missing user with a standardized error", async () => {
    const result = await requireUserExists("missing", {
      findUser: async () => null,
    });

    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.status, 404);
      assert.deepEqual(result.error, {
        code: "USER_NOT_FOUND",
        message: "User does not exist.",
      });
    }
  });

  it("allows room owners", async () => {
    const result = await requireRoomAccess("room_1", "owner_1", {
      findRoom: async () => ({ id: "room_1", owner_id: "owner_1" }),
      findRoomMember: async () => null,
    });

    assert.deepEqual(result, {
      ok: true,
      data: { room: { id: "room_1", owner_id: "owner_1" }, role: "owner" },
    });
  });

  it("allows room members", async () => {
    const result = await requireRoomAccess("room_1", "member_1", {
      findRoom: async () => ({ id: "room_1", owner_id: "owner_1" }),
      findRoomMember: async () => ({ room_id: "room_1", user_id: "member_1" }),
    });

    assert.deepEqual(result, {
      ok: true,
      data: { room: { id: "room_1", owner_id: "owner_1" }, role: "member" },
    });
  });

  it("rejects non-members", async () => {
    const result = await requireRoomAccess("room_1", "stranger_1", {
      findRoom: async () => ({ id: "room_1", owner_id: "owner_1" }),
      findRoomMember: async () => null,
    });

    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.status, 403);
      assert.deepEqual(result.error, {
        code: "ROOM_FORBIDDEN",
        message: "You are not a member of this room.",
      });
    }
  });
});
