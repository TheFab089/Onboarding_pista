import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { nanoid } from "nanoid";
import * as db from "./db";
import { storagePut } from "./storage";
import { invokeLLM } from "./_core/llm";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  onboarding: router({
    createSession: publicProcedure
      .input(z.object({
        clientName: z.string(),
        clientEmail: z.string().email().optional(),
        clientPhone: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const sessionId = nanoid();
        await db.createOnboardingSession({
          id: sessionId,
          clientName: input.clientName,
          clientEmail: input.clientEmail,
          clientPhone: input.clientPhone,
          currentStep: 1,
        });
        return { sessionId };
      }),

    getSession: publicProcedure
      .input(z.object({ sessionId: z.string() }))
      .query(async ({ input }) => {
        return await db.getOnboardingSession(input.sessionId);
      }),

    getAllSessions: publicProcedure
      .query(async () => {
        return await db.getAllOnboardingSessions();
      }),

    updateSession: publicProcedure
      .input(z.object({
        sessionId: z.string(),
        currentStep: z.number().optional(),
        completedAt: z.date().optional(),
      }))
      .mutation(async ({ input }) => {
        const { sessionId, ...updates } = input;
        await db.updateOnboardingSession(sessionId, updates);
        return { success: true };
      }),
  }),

  companyInfo: router({
    upsert: publicProcedure
      .input(z.object({
        sessionId: z.string(),
        companyName: z.string(),
        industry: z.string().optional(),
        foundedYear: z.number().optional(),
        numberOfEmployees: z.number().optional(),
        location: z.string().optional(),
        website: z.string().optional(),
        description: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = nanoid();
        await db.upsertCompanyInfo({ id, ...input });
        return { id, success: true };
      }),

    getBySession: publicProcedure
      .input(z.object({ sessionId: z.string() }))
      .query(async ({ input }) => {
        return await db.getCompanyInfoBySession(input.sessionId);
      }),
  }),

  processes: router({
    create: publicProcedure
      .input(z.object({
        sessionId: z.string(),
        processName: z.string(),
        category: z.string().optional(),
        description: z.string().optional(),
        currentState: z.string().optional(),
        painPoints: z.string().optional(),
        desiredState: z.string().optional(),
        priority: z.enum(["low", "medium", "high"]).optional(),
      }))
      .mutation(async ({ input }) => {
        const id = nanoid();
        await db.createBusinessProcess({ id, ...input });
        return { id, success: true };
      }),

    getBySession: publicProcedure
      .input(z.object({ sessionId: z.string() }))
      .query(async ({ input }) => {
        return await db.getBusinessProcessesBySession(input.sessionId);
      }),
  }),

  goals: router({
    create: publicProcedure
      .input(z.object({
        sessionId: z.string(),
        goalType: z.enum(["short_term", "long_term", "vision"]),
        title: z.string(),
        description: z.string().optional(),
        targetDate: z.date().optional(),
        priority: z.enum(["low", "medium", "high"]).optional(),
      }))
      .mutation(async ({ input }) => {
        const id = nanoid();
        await db.createGoalAndWish({ id, ...input });
        return { id, success: true };
      }),

    getBySession: publicProcedure
      .input(z.object({ sessionId: z.string() }))
      .query(async ({ input }) => {
        return await db.getGoalsAndWishesBySession(input.sessionId);
      }),
  }),

  values: router({
    create: publicProcedure
      .input(z.object({
        sessionId: z.string(),
        valueName: z.string(),
        description: z.string().optional(),
        examples: z.string().optional(),
        importance: z.number().min(1).max(10).optional(),
      }))
      .mutation(async ({ input }) => {
        const id = nanoid();
        await db.createCompanyValue({ id, ...input });
        return { id, success: true };
      }),

    getBySession: publicProcedure
      .input(z.object({ sessionId: z.string() }))
      .query(async ({ input }) => {
        return await db.getCompanyValuesBySession(input.sessionId);
      }),
  }),

  products: router({
    create: publicProcedure
      .input(z.object({
        sessionId: z.string(),
        productName: z.string(),
        category: z.string().optional(),
        description: z.string().optional(),
        unitPrice: z.number().optional(),
        unit: z.string().optional(),
        isService: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = nanoid();
        await db.createProduct({ id, ...input });
        return { id, success: true };
      }),

    getBySession: publicProcedure
      .input(z.object({ sessionId: z.string() }))
      .query(async ({ input }) => {
        return await db.getProductsBySession(input.sessionId);
      }),

    delete: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        await db.deleteProduct(input.id);
        return { success: true };
      }),
  }),

  suppliers: router({
    create: publicProcedure
      .input(z.object({
        sessionId: z.string(),
        supplierName: z.string(),
        contactPerson: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        products: z.string().optional(),
        paymentTerms: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = nanoid();
        await db.createSupplier({ id, ...input });
        return { id, success: true };
      }),

    getBySession: publicProcedure
      .input(z.object({ sessionId: z.string() }))
      .query(async ({ input }) => {
        return await db.getSuppliersBySession(input.sessionId);
      }),

    delete: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        await db.deleteSupplier(input.id);
        return { success: true };
      }),
  }),

  team: router({
    create: publicProcedure
      .input(z.object({
        sessionId: z.string(),
        memberName: z.string(),
        role: z.string().optional(),
        responsibilities: z.string().optional(),
        email: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = nanoid();
        await db.createTeamMember({ id, ...input });
        return { id, success: true };
      }),

    getBySession: publicProcedure
      .input(z.object({ sessionId: z.string() }))
      .query(async ({ input }) => {
        return await db.getTeamMembersBySession(input.sessionId);
      }),

    delete: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        await db.deleteTeamMember(input.id);
        return { success: true };
      }),
  }),

  software: router({
    create: publicProcedure
      .input(z.object({
        sessionId: z.string(),
        softwareName: z.string(),
        purpose: z.string().optional(),
        usersCount: z.number().optional(),
        monthlyCost: z.number().optional(),
        satisfactionLevel: z.number().min(1).max(10).optional(),
        needsReplacement: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = nanoid();
        await db.createCurrentSoftware({ id, ...input });
        return { id, success: true };
      }),

    getBySession: publicProcedure
      .input(z.object({ sessionId: z.string() }))
      .query(async ({ input }) => {
        return await db.getCurrentSoftwareBySession(input.sessionId);
      }),

    delete: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        await db.deleteCurrentSoftware(input.id);
        return { success: true };
      }),
  }),

  documents: router({
    upload: publicProcedure
      .input(z.object({
        sessionId: z.string(),
        documentType: z.string(),
        fileName: z.string(),
        fileData: z.string(), // base64 encoded
        mimeType: z.string(),
        description: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { fileData, fileName, mimeType, ...rest } = input;
        
        // Decode base64 and upload to S3
        const buffer = Buffer.from(fileData, 'base64');
        const fileKey = `onboarding/${input.sessionId}/${Date.now()}-${fileName}`;
        const { url } = await storagePut(fileKey, buffer, mimeType);
        
        const id = nanoid();
        await db.createDocument({
          id,
          ...rest,
          fileName,
          fileUrl: url,
          fileSize: buffer.length,
          mimeType,
        });
        
        return { id, url, success: true };
      }),

    getBySession: publicProcedure
      .input(z.object({ sessionId: z.string() }))
      .query(async ({ input }) => {
        return await db.getDocumentsBySession(input.sessionId);
      }),

    delete: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        await db.deleteDocument(input.id);
        return { success: true };
      }),
  }),

  chat: router({
    sendMessage: publicProcedure
      .input(z.object({
        sessionId: z.string(),
        message: z.string(),
      }))
      .mutation(async ({ input }) => {
        // Save user message
        const userMessageId = nanoid();
        await db.createChatMessage({
          id: userMessageId,
          sessionId: input.sessionId,
          role: "user",
          message: input.message,
        });

        // Get chat history
        const history = await db.getChatMessagesBySession(input.sessionId);
        
        // Build context for AI
        const systemPrompt = `Du bist ein hilfreicher Assistent für das Onboarding von Waldhauser Sanitär & Heizung für die Odoo-Implementierung durch PISTA Consulting. 
        
Deine Aufgabe ist es:
- Fragen zum Onboarding-Prozess zu beantworten
- Unklarheiten bei der Dateneingabe zu klären
- Tipps zu geben, welche Informationen wichtig sind
- Zu erklären, warum bestimmte Daten für die Odoo-Implementierung benötigt werden
- Beispiele zu geben, wenn der Kunde nicht weiß, was einzutragen ist

Antworte immer auf Deutsch, freundlich und professionell. Halte dich kurz und präzise.`;

        const messages: Array<{role: "system" | "user" | "assistant", content: string}> = [
          { role: "system" as const, content: systemPrompt },
          ...history.slice(-10).map(msg => ({
            role: msg.role as "user" | "assistant",
            content: msg.message
          })),
        ];

        // Get AI response
        const aiResponse = await invokeLLM({ messages });
        const content = aiResponse.choices[0]?.message?.content;
        const assistantMessage = typeof content === 'string' ? content : "Entschuldigung, ich konnte keine Antwort generieren.";

        // Save assistant message
        const assistantMessageId = nanoid();
        await db.createChatMessage({
          id: assistantMessageId,
          sessionId: input.sessionId,
          role: "assistant",
          message: assistantMessage,
        });

        return { 
          message: assistantMessage,
          success: true 
        };
      }),

    getHistory: publicProcedure
      .input(z.object({ sessionId: z.string() }))
      .query(async ({ input }) => {
        return await db.getChatMessagesBySession(input.sessionId);
      }),
  }),
});

export type AppRouter = typeof appRouter;

