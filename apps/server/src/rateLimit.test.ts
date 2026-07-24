import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createRateLimiter } from "./rateLimit";

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

describe("rate limiter", () => {
  it("allows requests within the limit", () => {
    let nextCalls = 0;
    const limiter = createRateLimiter({
      max: 2,
      windowMs: 1000,
      key: () => "client_1",
      now: () => 100,
    });

    limiter({}, new FakeResponse(), () => nextCalls++);
    limiter({}, new FakeResponse(), () => nextCalls++);

    assert.equal(nextCalls, 2);
  });

  it("rejects requests over the limit with a standardized error", () => {
    let nextCalls = 0;
    const limiter = createRateLimiter({
      max: 1,
      windowMs: 1000,
      key: () => "client_1",
      now: () => 100,
    });
    const res = new FakeResponse();

    limiter({}, new FakeResponse(), () => nextCalls++);
    limiter({}, res, () => nextCalls++);

    assert.equal(nextCalls, 1);
    assert.equal(res.statusCode, 429);
    assert.deepEqual(res.body, {
      error: {
        code: "RATE_LIMITED",
        message: "Too many requests. Try again later.",
      },
    });
  });

  it("resets the request count after the window", () => {
    let currentTime = 100;
    let nextCalls = 0;
    const limiter = createRateLimiter({
      max: 1,
      windowMs: 1000,
      key: () => "client_1",
      now: () => currentTime,
    });

    limiter({}, new FakeResponse(), () => nextCalls++);
    currentTime = 1200;
    limiter({}, new FakeResponse(), () => nextCalls++);

    assert.equal(nextCalls, 2);
  });
});
