import {  sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";

export const user = sqliteTable("user", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
