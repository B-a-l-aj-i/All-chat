import { app } from "./app";
import { type Request, type Response } from "express";

import { db } from "@all-chat/db";
import { chats } from "@all-chat/db/schema/chats";
import { user } from "@all-chat/db/schema/user";
import { asc, eq } from "drizzle-orm";

// Read every message in a room, oldest first. Joins the sender's username so
// the client can label + color-code messages per user.
app.get("/chats", async (req: Request, res: Response) => {
  const roomId = req.query.room_id as string | undefined;

  if (!roomId) {
    return res.status(400).json({ error: "room_id is required" });
  }

  try {
    const messages = await db
      .select({
        id: chats.id,
        room_id: chats.room_id,
        user_id: chats.user_id,
        username: user.username,
        text: chats.text,
        created_at: chats.created_at,
      })
      .from(chats)
      .innerJoin(user, eq(user.id, chats.user_id))
      .where(eq(chats.room_id, roomId))
      .orderBy(asc(chats.created_at));

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Database fetch failed" });
  }
});

// Write a text message to a room.
app.post("/chats", async (req: Request, res: Response) => {
  const { room_id, user_id, text } = req.body;

  if (!room_id || !user_id || !text) {
    return res
      .status(400)
      .json({ error: "room_id, user_id and text are required" });
  }

  try {
    const inserted = await db
      .insert(chats)
      .values({ room_id, user_id, text })
      .returning();

    res.status(201).json(inserted[0]);
  } catch (error) {
    console.log(error);

    res.status(400).json({ error: "Could not save message" });
  }
});
