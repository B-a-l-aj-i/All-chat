import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";

export const room = sqliteTable("room", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  room_name: text("room_name").notNull().unique(),
  description: text("description"),
  password: text("password").notNull(),
});

export type Room = typeof room.$inferSelect;
export type NewRoom = typeof room.$inferInsert;
