import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { room } from "./room";
import { user } from "./user";

// Join table for the many-to-many between rooms and users:
// one row = "this user is a member of this room".
export const roomMembers = sqliteTable(
  "room_members",
  {
    room_id: text("room_id")
      .notNull()
      .references(() => room.id),
    user_id: text("user_id")
      .notNull()
      .references(() => user.id),
    joined_at: integer("joined_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => [primaryKey({ columns: [t.room_id, t.user_id] })],
);

export type RoomMember = typeof roomMembers.$inferSelect;
export type NewRoomMember = typeof roomMembers.$inferInsert;
