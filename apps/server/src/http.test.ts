import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { z } from "zod";
import { parseInput, sendError, sendSuccess } from "./http";

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

describe("http helpers", () => {
  it("parses valid input through a schema", () => {
    const schema = z.object({ name: z.string().trim().min(1) });

    const result = parseInput(schema, { name: "  general  " });

    assert.deepEqual(result, { ok: true, data: { name: "general" } });
  });

  it("returns a standardized validation error for invalid input", () => {
    const schema = z.object({ name: z.string().trim().min(1) });

    const result = parseInput(schema, { name: "" });

    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.status, 400);
      assert.equal(result.error.code, "VALIDATION_ERROR");
      assert.match(result.error.message, /name/i);
    }
  });

  it("sends standardized success and error responses", () => {
    const success = new FakeResponse();
    const failure = new FakeResponse();

    sendSuccess(success, { id: "room_1" }, 201);
    sendError(failure, 403, "ROOM_FORBIDDEN", "You are not a member of this room.");

    assert.equal(success.statusCode, 201);
    assert.deepEqual(success.body, { data: { id: "room_1" } });
    assert.equal(failure.statusCode, 403);
    assert.deepEqual(failure.body, {
      error: {
        code: "ROOM_FORBIDDEN",
        message: "You are not a member of this room.",
      },
    });
  });
});
