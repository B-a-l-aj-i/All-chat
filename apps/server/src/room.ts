import { app } from "./app";
import { type Request, type Response } from "express";

import { db } from "@all-chat/db";
import { room } from "@all-chat/db/schema/room";
import { eq } from "drizzle-orm";

app.get("/rooms", async (_req: Request, res: Response) => {
  try {
    const allUsers = await db.select().from(room);
    res.json(allUsers);
  } catch (error) {
    res.status(500).json({ error: "Database fetch failed" });
  }
});

app.post("/create-room", async (req: Request, res: Response) => {
  const { room_name, description, password } = req.body;

  try {
    const isRoomAlreadyExist = await db
      .select()
      .from(room)
      .where(eq(room.room_name, room_name));

    if (isRoomAlreadyExist.length >= 1) {
      res.status(409).json({
        message: "Room already exists",
      });
    }

    const newRoom = await db
      .insert(room)
      .values({ room_name, description, password })
      .returning({ room_name: room.room_name, description: room.description });

    res
      .status(200)
      .json({ message: "room created successfully", data: newRoom[0] });
  } catch (error) {
    console.log(error);

    res.status(400).json({ error: "Could not create room" });
  }
});
