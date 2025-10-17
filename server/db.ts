import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users,
  onboardingSessions,
  InsertOnboardingSession,
  companyInfo,
  InsertCompanyInfo,
  businessProcesses,
  InsertBusinessProcess,
  goalsAndWishes,
  InsertGoalAndWish,
  companyValues,
  InsertCompanyValue
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.id) {
    throw new Error("User ID is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      id: user.id,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role === undefined) {
      if (user.id === ENV.ownerId) {
        user.role = 'admin';
        values.role = 'admin';
        updateSet.role = 'admin';
      }
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUser(id: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Onboarding session helpers
export async function createOnboardingSession(session: InsertOnboardingSession) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(onboardingSessions).values(session);
  return session;
}

export async function getOnboardingSession(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(onboardingSessions).where(eq(onboardingSessions.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateOnboardingSession(id: string, data: Partial<InsertOnboardingSession>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(onboardingSessions).set({ ...data, updatedAt: new Date() }).where(eq(onboardingSessions.id, id));
}

export async function getAllOnboardingSessions() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(onboardingSessions).orderBy(desc(onboardingSessions.createdAt));
}

// Company info helpers
export async function upsertCompanyInfo(info: InsertCompanyInfo) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(companyInfo).values(info).onDuplicateKeyUpdate({
    set: { ...info, updatedAt: new Date() }
  });
}

export async function getCompanyInfoBySession(sessionId: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(companyInfo).where(eq(companyInfo.sessionId, sessionId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Business process helpers
export async function createBusinessProcess(process: InsertBusinessProcess) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(businessProcesses).values(process);
}

export async function getBusinessProcessesBySession(sessionId: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(businessProcesses).where(eq(businessProcesses.sessionId, sessionId));
}

export async function updateBusinessProcess(id: string, data: Partial<InsertBusinessProcess>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(businessProcesses).set({ ...data, updatedAt: new Date() }).where(eq(businessProcesses.id, id));
}

export async function deleteBusinessProcess(id: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(businessProcesses).where(eq(businessProcesses.id, id));
}

// Goals and wishes helpers
export async function createGoalAndWish(goal: InsertGoalAndWish) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(goalsAndWishes).values(goal);
}

export async function getGoalsAndWishesBySession(sessionId: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(goalsAndWishes).where(eq(goalsAndWishes.sessionId, sessionId));
}

export async function updateGoalAndWish(id: string, data: Partial<InsertGoalAndWish>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(goalsAndWishes).set({ ...data, updatedAt: new Date() }).where(eq(goalsAndWishes.id, id));
}

export async function deleteGoalAndWish(id: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(goalsAndWishes).where(eq(goalsAndWishes.id, id));
}

// Company values helpers
export async function createCompanyValue(value: InsertCompanyValue) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(companyValues).values(value);
}

export async function getCompanyValuesBySession(sessionId: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(companyValues).where(eq(companyValues.sessionId, sessionId));
}

export async function updateCompanyValue(id: string, data: Partial<InsertCompanyValue>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(companyValues).set({ ...data, updatedAt: new Date() }).where(eq(companyValues.id, id));
}

export async function deleteCompanyValue(id: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(companyValues).where(eq(companyValues.id, id));
}

