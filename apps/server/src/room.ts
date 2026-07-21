import { app } from "./app";
import { type Request, type Response } from "express";

import { db } from "@all-chat/db";
import { room } from "@all-chat/db/schema/room";
import { eq } from "drizzle-orm";

// Rooms owned by the requesting user. The client passes its userId (from
// localStorage / getOrCreateUser) as a query param.
app.get("/my-rooms", async (req: Request, res: Response) => {
  const userId = req.query.userId as string | undefined;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  try {
    const myRooms = await db
      .select()
      .from(room)
      .where(eq(room.owner_id, userId));
    res.json(myRooms);
  } catch (error) {
    res.status(500).json({ error: "Database fetch failed" });
  }
});

app.post("/create-room", async (req: Request, res: Response) => {
  const { room_name, description, password, owner_id } = req.body;

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
      .values({ room_name, description, password, owner_id })
      .returning({ room_name: room.room_name, description: room.description });

    res
      .status(200)
      .json({ message: "room created successfully", data: newRoom[0] });
  } catch (error) {
    console.log(error);

    res.status(400).json({ error: "Could not create room" });
  }
});
