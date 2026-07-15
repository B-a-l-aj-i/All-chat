import { app } from "./app";
import { type Request, type Response } from "express";

import { db } from "@all-chat/db";
import { room } from "@all-chat/db/schema/room";


app.get("/rooms", async (_req: Request, res: Response) => {
    try {
      const allUsers = await db.select().from(room);
      res.json(allUsers);
    } catch (error) {
      res.status(500).json({ error: "Database fetch failed" });
    }
  });
  
app.post("/create-room", async (req: Request, res: Response) => {
    const { room_name, password } = req.body;
    try {
      const newRoom = await db
        .insert(room)
        .values({ room_name, password })
        .returning();
      res.status(201).json(newRoom[0]);
    } catch (error) {
      console.log(error);
  
      res.status(400).json({ error: "Could not create user" });
    }
});