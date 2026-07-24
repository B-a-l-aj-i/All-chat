import { app } from "./app";
import { db } from "@all-chat/db";
import { user } from "@all-chat/db/schema/user";
import { AnonymousNames } from "anonymous-names";
import {
  createLocalUserHandler,
  createUserHandler,
  disabledUsersHandler,
} from "./userHandlers";

const nameGenerator = new AnonymousNames();

app.get("/users", disabledUsersHandler);

app.post(
  "/create-user",
  createUserHandler({
    async createUser(input) {
      const newUser = await db.insert(user).values(input).returning();
      return newUser[0]!;
    },
  }),
);

// Anonymous visitor: the server mints the id. The client only calls this on
// first visit (when localStorage is empty) and stores the returned id.
app.post(
  "/create-local-user",
  createLocalUserHandler({
    async createLocalUser() {
      const newUser = await db
        .insert(user)
        .values({
        username: nameGenerator.generateName(),
        password: "anonymous",
        is_anonymous: true,
      })
        .returning();

      return newUser[0]!;
    },
  }),
);
