import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";

export const user = sqliteTable("user", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  username: text("username").notNull().default("anonymous"),
  password: text("password").notNull().default("anonymous"),
  is_anonymous: integer("is_anonymous", { mode: "boolean" })
    .notNull()
    .default(true),
});

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
