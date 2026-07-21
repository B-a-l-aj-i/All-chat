DROP INDEX `user_username_unique`;--> statement-breakpoint
DROP INDEX "room_room_name_unique";--> statement-breakpoint
ALTER TABLE `user` ALTER COLUMN "username" TO "username" text NOT NULL DEFAULT 'anonymous';--> statement-breakpoint
CREATE UNIQUE INDEX `room_room_name_unique` ON `room` (`room_name`);--> statement-breakpoint
ALTER TABLE `user` ALTER COLUMN "password" TO "password" text NOT NULL DEFAULT 'anonymous';--> statement-breakpoint
ALTER TABLE `user` ADD `is_anonymous` integer DEFAULT true NOT NULL;