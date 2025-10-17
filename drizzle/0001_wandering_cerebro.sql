CREATE TABLE `business_processes` (
	`id` varchar(64) NOT NULL,
	`sessionId` varchar(64) NOT NULL,
	`processName` varchar(255) NOT NULL,
	`category` varchar(100),
	`description` text,
	`currentState` text,
	`painPoints` text,
	`desiredState` text,
	`priority` enum('low','medium','high') DEFAULT 'medium',
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `business_processes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `company_info` (
	`id` varchar(64) NOT NULL,
	`sessionId` varchar(64) NOT NULL,
	`companyName` varchar(255),
	`industry` varchar(100),
	`foundedYear` int,
	`numberOfEmployees` int,
	`location` varchar(255),
	`website` varchar(500),
	`description` text,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `company_info_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `company_values` (
	`id` varchar(64) NOT NULL,
	`sessionId` varchar(64) NOT NULL,
	`valueName` varchar(255) NOT NULL,
	`description` text,
	`examples` text,
	`importance` int DEFAULT 5,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `company_values_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `goals_and_wishes` (
	`id` varchar(64) NOT NULL,
	`sessionId` varchar(64) NOT NULL,
	`goalType` enum('short_term','long_term','vision') NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`targetDate` timestamp,
	`priority` enum('low','medium','high') DEFAULT 'medium',
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `goals_and_wishes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `onboarding_sessions` (
	`id` varchar(64) NOT NULL,
	`clientName` varchar(255) NOT NULL,
	`clientEmail` varchar(320),
	`clientPhone` varchar(50),
	`currentStep` int NOT NULL DEFAULT 1,
	`completedAt` timestamp,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `onboarding_sessions_id` PRIMARY KEY(`id`)
);
