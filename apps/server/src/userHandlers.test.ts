import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createLocalUserHandler,
  createUserHandler,
  disabledUsersHandler,
} from "./userHandlers";

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

describe("user handlers", () => {
  it("rejects invalid create-user bodies", async () => {
    const res = new FakeResponse();
    const handler = createUserHandler({
      createUser: async () => ({
        id: "user_1",
        username: "ignored",
        password: "secret",
        is_anonymous: false,
      }),
    });

    await handler({ body: { username: "", password: "" } }, res);

    assert.equal(res.statusCode, 400);
    assert.deepEqual((res.body as { error: { code: string } }).error.code, "VALIDATION_ERROR");
  });

  it("returns a safe create-user response without password", async () => {
    const res = new FakeResponse();
    const handler = createUserHandler({
      createUser: async () => ({
        id: "user_1",
        username: "ada",
        password: "secret",
        is_anonymous: false,
      }),
    });

    await handler({ body: { username: " ada ", password: "secret" } }, res);

    assert.equal(res.statusCode, 201);
    assert.deepEqual(res.body, {
      data: {
        id: "user_1",
        username: "ada",
        is_anonymous: false,
      },
    });
  });

  it("returns a safe anonymous user response without password", async () => {
    const res = new FakeResponse();
    const handler = createLocalUserHandler({
      createLocalUser: async () => ({
        id: "user_2",
        username: "Anonymous Zebra",
        password: "anonymous",
        is_anonymous: true,
      }),
    });

    await handler({}, res);

    assert.equal(res.statusCode, 201);
    assert.deepEqual(res.body, {
      data: {
        id: "user_2",
        username: "Anonymous Zebra",
        is_anonymous: true,
      },
    });
  });

  it("disables the all-users endpoint", async () => {
    const res = new FakeResponse();

    await disabledUsersHandler({}, res);

    assert.equal(res.statusCode, 404);
    assert.deepEqual(res.body, {
      error: {
        code: "NOT_FOUND",
        message: "Endpoint not found.",
      },
    });
  });
});
