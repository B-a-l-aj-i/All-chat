import { app } from "./app";
import { type Request, type Response } from "express";

import { db } from "@all-chat/db";
import { room } from "@all-chat/db/schema/room";
import { roomMembers } from "@all-chat/db/schema/roomMembers";
import { eq, inArray, or } from "drizzle-orm";

// Rooms the requesting user belongs to: ones they own OR ones they've joined
// (a membership row in room_members). The client passes its userId (from
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
      .where(
        or(
          eq(room.owner_id, userId),
          inArray(
            room.id,
            db
              .select({ id: roomMembers.room_id })
              .from(roomMembers)
              .where(eq(roomMembers.user_id, userId)),
          ),
        ),
      );

      console.log(myRooms);
      

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

// Join a room by name + password. Verifies the room exists and the password
// matches, then records membership. Re-joining is a no-op (composite PK).
app.post("/join-room", async (req: Request, res: Response) => {
  const { room_name, password, user_id } = req.body;

  console.log(room_name, password, user_id);

  if (!room_name || !password || !user_id) {
    return res
      .status(400)
      .json({ error: "room_name, password and user_id are required" });
  }

  try {
    const existing = await db
      .select()
      .from(room)
      .where(eq(room.room_name, room_name));

    const targetRoom = existing[0];

    if (!targetRoom) {
      return res.status(404).json({ error: "Room does not exist" });
    }

    if (targetRoom.password !== password) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    await db
      .insert(roomMembers)
      .values({ room_id: targetRoom.id, user_id })
      .onConflictDoNothing();

    return res.status(200).json({
      message: "joined room successfully",
      data: {
        id: targetRoom.id,
        room_name: targetRoom.room_name,
        description: targetRoom.description,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(400).json({ error: "Could not join room" });
  }
});
