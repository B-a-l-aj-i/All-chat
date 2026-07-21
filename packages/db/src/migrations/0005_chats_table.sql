CREATE TABLE `chats` (
	`id` text PRIMARY KEY NOT NULL,
	`room_id` text NOT NULL,
	`user_id` text NOT NULL,
	`text` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`room_id`) REFERENCES `room`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
