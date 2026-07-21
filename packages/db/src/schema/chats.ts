import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";
import { room } from "./room";
import { user } from "./user";

// One text message in a room. Text-only for now (add a `kind` column later
// when files/media/etc. are supported).
export const chats = sqliteTable("chats", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  room_id: text("room_id")
    .notNull()
    .references(() => room.id),
  user_id: text("user_id")
    .notNull()
    .references(() => user.id),
  text: text("text").notNull(),
  created_at: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export type Chat = typeof chats.$inferSelect;
export type NewChat = typeof chats.$inferInsert;
