import { z } from "zod";

const idSchema = z.string().trim().min(1).max(128);
const roomNameSchema = z.string().trim().min(1).max(80);
const descriptionSchema = z.string().trim().max(280);
const passwordSchema = z.string().min(1).max(256);

export const createUserBodySchema = z.object({
  username: z.string().trim().min(1).max(80),
  password: passwordSchema,
});

export const createRoomBodySchema = z.object({
  room_name: roomNameSchema,
  description: descriptionSchema,
  password: passwordSchema,
  owner_id: idSchema,
});

export const joinRoomBodySchema = z.object({
  room_name: roomNameSchema,
  password: passwordSchema,
  user_id: idSchema,
});

export const myRoomsQuerySchema = z.object({
  userId: idSchema,
});

export const getChatsQuerySchema = z.object({
  room_id: idSchema,
  user_id: idSchema,
});

export const sendChatBodySchema = z.object({
  room_id: idSchema,
  user_id: idSchema,
  text: z.string().trim().min(1).max(2000),
});

export const socketRoomPayloadSchema = z.object({
  room_id: idSchema,
  user_id: idSchema,
});

export const aiBodySchema = z.object({
  messages: z.array(z.unknown()).max(20).default([]),
});
