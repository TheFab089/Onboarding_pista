import { mysqlEnum, mysqlTable, text, timestamp, varchar, int, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Onboarding sessions for clients
 */
export const onboardingSessions = mysqlTable("onboarding_sessions", {
  id: varchar("id", { length: 64 }).primaryKey(),
  clientName: varchar("clientName", { length: 255 }).notNull(),
  clientEmail: varchar("clientEmail", { length: 320 }),
  clientPhone: varchar("clientPhone", { length: 50 }),
  currentStep: int("currentStep").default(1).notNull(),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type OnboardingSession = typeof onboardingSessions.$inferSelect;
export type InsertOnboardingSession = typeof onboardingSessions.$inferInsert;

/**
 * Company information captured during onboarding
 */
export const companyInfo = mysqlTable("company_info", {
  id: varchar("id", { length: 64 }).primaryKey(),
  sessionId: varchar("sessionId", { length: 64 }).notNull(),
  companyName: varchar("companyName", { length: 255 }),
  industry: varchar("industry", { length: 100 }),
  foundedYear: int("foundedYear"),
  numberOfEmployees: int("numberOfEmployees"),
  location: varchar("location", { length: 255 }),
  website: varchar("website", { length: 500 }),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type CompanyInfo = typeof companyInfo.$inferSelect;
export type InsertCompanyInfo = typeof companyInfo.$inferInsert;

/**
 * Business processes documented during onboarding
 */
export const businessProcesses = mysqlTable("business_processes", {
  id: varchar("id", { length: 64 }).primaryKey(),
  sessionId: varchar("sessionId", { length: 64 }).notNull(),
  processName: varchar("processName", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }),
  description: text("description"),
  currentState: text("currentState"),
  painPoints: text("painPoints"),
  desiredState: text("desiredState"),
  priority: mysqlEnum("priority", ["low", "medium", "high"]).default("medium"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type BusinessProcess = typeof businessProcesses.$inferSelect;
export type InsertBusinessProcess = typeof businessProcesses.$inferInsert;

/**
 * Goals and wishes captured during onboarding
 */
export const goalsAndWishes = mysqlTable("goals_and_wishes", {
  id: varchar("id", { length: 64 }).primaryKey(),
  sessionId: varchar("sessionId", { length: 64 }).notNull(),
  goalType: mysqlEnum("goalType", ["short_term", "long_term", "vision"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  targetDate: timestamp("targetDate"),
  priority: mysqlEnum("priority", ["low", "medium", "high"]).default("medium"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type GoalAndWish = typeof goalsAndWishes.$inferSelect;
export type InsertGoalAndWish = typeof goalsAndWishes.$inferInsert;

/**
 * Company values and philosophy
 */
export const companyValues = mysqlTable("company_values", {
  id: varchar("id", { length: 64 }).primaryKey(),
  sessionId: varchar("sessionId", { length: 64 }).notNull(),
  valueName: varchar("valueName", { length: 255 }).notNull(),
  description: text("description"),
  examples: text("examples"),
  importance: int("importance").default(5),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type CompanyValue = typeof companyValues.$inferSelect;
export type InsertCompanyValue = typeof companyValues.$inferInsert;

