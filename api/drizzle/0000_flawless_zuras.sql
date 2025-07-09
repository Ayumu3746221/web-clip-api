CREATE TABLE `ClipTags` (
	`clip_id` text NOT NULL,
	`tag_id` text NOT NULL,
	PRIMARY KEY(`clip_id`, `tag_id`),
	FOREIGN KEY (`clip_id`) REFERENCES `Clips`(`clip_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tag_id`) REFERENCES `Tags`(`tag_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Clips` (
	`clip_id` text PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`clip_name` text NOT NULL,
	`clip_comment` text NOT NULL,
	`clip_url` text NOT NULL,
	`create_date` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`update_date` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `Users`(`user_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `Clips_user_id_idx` ON `Clips` (`user_id`);--> statement-breakpoint
CREATE INDEX `Clips_clip_name_idx` ON `Clips` (`clip_name`);--> statement-breakpoint
CREATE TABLE `Tags` (
	`tag_id` text PRIMARY KEY NOT NULL,
	`tag_name` text NOT NULL,
	`create_date` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`update_date` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Tags_tag_name_unique` ON `Tags` (`tag_name`);--> statement-breakpoint
CREATE INDEX `Tags_tag_name_idx` ON `Tags` (`tag_name`);--> statement-breakpoint
CREATE TABLE `UserAuthentications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`provider` text NOT NULL,
	`provider_user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `Users`(`user_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `UserAuthentications_provider_user_id_idx` ON `UserAuthentications` (`provider_user_id`);--> statement-breakpoint
CREATE TABLE `Users` (
	`user_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`username` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Users_email_unique` ON `Users` (`email`);--> statement-breakpoint
CREATE INDEX `Users_email_idx` ON `Users` (`email`);