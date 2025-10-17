import { eq } from "drizzle-orm";
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
  InsertCompanyValue,
  products,
  InsertProduct,
  suppliers,
  InsertSupplier,
  teamMembers,
  InsertTeamMember,
  currentSoftware,
  InsertCurrentSoftware,
  documents,
  InsertDocument,
  chatMessages,
  InsertChatMessage
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

// Onboarding Sessions
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

export async function getAllOnboardingSessions() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(onboardingSessions);
}

export async function updateOnboardingSession(id: string, updates: Partial<InsertOnboardingSession>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(onboardingSessions).set(updates).where(eq(onboardingSessions.id, id));
}

// Company Info
export async function upsertCompanyInfo(info: InsertCompanyInfo) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(companyInfo).values(info).onDuplicateKeyUpdate({ set: info });
}

export async function getCompanyInfoBySession(sessionId: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(companyInfo).where(eq(companyInfo.sessionId, sessionId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Business Processes
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

// Goals and Wishes
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

// Company Values
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

// Products
export async function createProduct(product: InsertProduct) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(products).values(product);
}

export async function getProductsBySession(sessionId: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(products).where(eq(products.sessionId, sessionId));
}

export async function deleteProduct(id: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(products).where(eq(products.id, id));
}

// Suppliers
export async function createSupplier(supplier: InsertSupplier) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(suppliers).values(supplier);
}

export async function getSuppliersBySession(sessionId: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(suppliers).where(eq(suppliers.sessionId, sessionId));
}

export async function deleteSupplier(id: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(suppliers).where(eq(suppliers.id, id));
}

// Team Members
export async function createTeamMember(member: InsertTeamMember) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(teamMembers).values(member);
}

export async function getTeamMembersBySession(sessionId: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(teamMembers).where(eq(teamMembers.sessionId, sessionId));
}

export async function deleteTeamMember(id: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(teamMembers).where(eq(teamMembers.id, id));
}

// Current Software
export async function createCurrentSoftware(software: InsertCurrentSoftware) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(currentSoftware).values(software);
}

export async function getCurrentSoftwareBySession(sessionId: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(currentSoftware).where(eq(currentSoftware.sessionId, sessionId));
}

export async function deleteCurrentSoftware(id: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(currentSoftware).where(eq(currentSoftware.id, id));
}

// Documents
export async function createDocument(document: InsertDocument) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(documents).values(document);
}

export async function getDocumentsBySession(sessionId: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(documents).where(eq(documents.sessionId, sessionId));
}

export async function deleteDocument(id: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(documents).where(eq(documents.id, id));
}

// Chat Messages
export async function createChatMessage(message: InsertChatMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(chatMessages).values(message);
}

export async function getChatMessagesBySession(sessionId: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(chatMessages).where(eq(chatMessages.sessionId, sessionId));
}

