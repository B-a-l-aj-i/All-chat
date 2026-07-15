CREATE TABLE `room` (
	`id` text PRIMARY KEY NOT NULL,
	`room_name` text NOT NULL,
	`description` text,
	`password` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `room_room_name_unique` ON `room` (`room_name`);