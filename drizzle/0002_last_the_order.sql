CREATE TABLE `chat_messages` (
	`id` varchar(64) NOT NULL,
	`sessionId` varchar(64) NOT NULL,
	`role` enum('user','assistant') NOT NULL,
	`message` text NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `chat_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `current_software` (
	`id` varchar(64) NOT NULL,
	`sessionId` varchar(64) NOT NULL,
	`softwareName` varchar(255) NOT NULL,
	`purpose` varchar(255),
	`usersCount` int,
	`monthlyCost` int,
	`satisfactionLevel` int,
	`needsReplacement` boolean DEFAULT false,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `current_software_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` varchar(64) NOT NULL,
	`sessionId` varchar(64) NOT NULL,
	`documentType` varchar(100) NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`fileUrl` varchar(1000) NOT NULL,
	`fileSize` int,
	`mimeType` varchar(100),
	`description` text,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` varchar(64) NOT NULL,
	`sessionId` varchar(64) NOT NULL,
	`productName` varchar(255) NOT NULL,
	`category` varchar(100),
	`description` text,
	`unitPrice` int,
	`unit` varchar(50),
	`isService` boolean DEFAULT false,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `suppliers` (
	`id` varchar(64) NOT NULL,
	`sessionId` varchar(64) NOT NULL,
	`supplierName` varchar(255) NOT NULL,
	`contactPerson` varchar(255),
	`email` varchar(320),
	`phone` varchar(50),
	`products` text,
	`paymentTerms` varchar(255),
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `suppliers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `team_members` (
	`id` varchar(64) NOT NULL,
	`sessionId` varchar(64) NOT NULL,
	`memberName` varchar(255) NOT NULL,
	`role` varchar(100),
	`responsibilities` text,
	`email` varchar(320),
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `team_members_id` PRIMARY KEY(`id`)
);
