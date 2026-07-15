import { app } from "./app";
import { db } from "@all-chat/db";
import { user } from "@all-chat/db/schema/user";
import type { Request, Response } from "express";

app.get("/users", async (_req: Request, res: Response) => {
  try {
    const allUsers = await db.select().from(user);
    res.json(allUsers);
  } catch (error) {
    res.status(500).json({ error: "Database fetch failed" });
  }
});

app.post("/create-user", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const newUser = await db
      .insert(user)
      .values({ username, password })
      .returning();
    res.status(201).json(newUser[0]);
  } catch (error) {
    console.log(error);

    res.status(400).json({ error: "Could not create user" });
  }
});
