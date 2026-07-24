import { createRateLimiter } from "./rateLimit";

const minute = 60_000;

export const createLocalUserLimiter = createRateLimiter({
  max: 20,
  windowMs: minute,
});

export const joinRoomLimiter = createRateLimiter({
  max: 10,
  windowMs: minute,
});

export const sendChatLimiter = createRateLimiter({
  max: 60,
  windowMs: minute,
});

export const aiLimiter = createRateLimiter({
  max: 20,
  windowMs: minute,
});
