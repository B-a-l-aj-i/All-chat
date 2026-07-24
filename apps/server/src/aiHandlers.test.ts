import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createAiHandler } from "./aiHandlers";

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

describe("ai handler", () => {
  it("rejects oversized message arrays", async () => {
    let streamed = false;
    const res = new FakeResponse();
    const handler = createAiHandler({
      stream: async () => {
        streamed = true;
      },
    });

    await handler({ body: { messages: Array.from({ length: 21 }, () => ({})) } }, res);

    assert.equal(streamed, false);
    assert.equal(res.statusCode, 400);
    assert.deepEqual((res.body as { error: { code: string } }).error.code, "VALIDATION_ERROR");
  });

  it("streams validated messages", async () => {
    let streamedMessages: unknown[] | undefined;
    const res = new FakeResponse();
    const handler = createAiHandler({
      stream: async (messages) => {
        streamedMessages = messages;
      },
    });

    await handler({ body: { messages: [{ id: "message_1" }] } }, res);

    assert.deepEqual(streamedMessages, [{ id: "message_1" }]);
  });

  it("defaults missing messages to an empty array", async () => {
    let streamedMessages: unknown[] | undefined;
    const res = new FakeResponse();
    const handler = createAiHandler({
      stream: async (messages) => {
        streamedMessages = messages;
      },
    });

    await handler({ body: {} }, res);

    assert.deepEqual(streamedMessages, []);
  });
});
