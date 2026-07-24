import type { NextFunction, Request } from "express";
import { sendError } from "./http";

interface RateLimitResponse {
  status(code: number): RateLimitResponse;
  json(body: unknown): RateLimitResponse;
}

interface RateLimiterOptions {
  max: number;
  windowMs: number;
  key?: (req: unknown) => string;
  now?: () => number;
}

interface Bucket {
  count: number;
  resetAt: number;
}

export function createRateLimiter(options: RateLimiterOptions) {
  const buckets = new Map<string, Bucket>();
  const getKey = options.key ?? defaultKey;
  const now = options.now ?? Date.now;

  return (req: unknown, res: RateLimitResponse, next: NextFunction) => {
    const currentTime = now();
    const key = getKey(req);
    const bucket = buckets.get(key);

    if (!bucket || currentTime >= bucket.resetAt) {
      buckets.set(key, {
        count: 1,
        resetAt: currentTime + options.windowMs,
      });
      next();
      return;
    }

    if (bucket.count >= options.max) {
      sendError(res, 429, "RATE_LIMITED", "Too many requests. Try again later.");
      return;
    }

    bucket.count += 1;
    next();
  };
}

function defaultKey(req: unknown): string {
  const request = req as Partial<Pick<Request, "ip">>;
  return request.ip ?? "unknown";
}
