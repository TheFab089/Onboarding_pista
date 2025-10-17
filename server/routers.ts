import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { nanoid } from "nanoid";
import * as db from "./db";

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

    updateSession: publicProcedure
      .input(z.object({
        sessionId: z.string(),
        currentStep: z.number().optional(),
        completedAt: z.date().optional(),
      }))
      .mutation(async ({ input }) => {
        const { sessionId, ...data } = input;
        await db.updateOnboardingSession(sessionId, data);
        return { success: true };
      }),

    getAllSessions: publicProcedure
      .query(async () => {
        return await db.getAllOnboardingSessions();
      }),
  }),

  companyInfo: router({
    upsert: publicProcedure
      .input(z.object({
        sessionId: z.string(),
        companyName: z.string().optional(),
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
        return { success: true };
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

    update: publicProcedure
      .input(z.object({
        id: z.string(),
        processName: z.string().optional(),
        category: z.string().optional(),
        description: z.string().optional(),
        currentState: z.string().optional(),
        painPoints: z.string().optional(),
        desiredState: z.string().optional(),
        priority: z.enum(["low", "medium", "high"]).optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateBusinessProcess(id, data);
        return { success: true };
      }),

    delete: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        await db.deleteBusinessProcess(input.id);
        return { success: true };
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

    update: publicProcedure
      .input(z.object({
        id: z.string(),
        goalType: z.enum(["short_term", "long_term", "vision"]).optional(),
        title: z.string().optional(),
        description: z.string().optional(),
        targetDate: z.date().optional(),
        priority: z.enum(["low", "medium", "high"]).optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateGoalAndWish(id, data);
        return { success: true };
      }),

    delete: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        await db.deleteGoalAndWish(input.id);
        return { success: true };
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

    update: publicProcedure
      .input(z.object({
        id: z.string(),
        valueName: z.string().optional(),
        description: z.string().optional(),
        examples: z.string().optional(),
        importance: z.number().min(1).max(10).optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateCompanyValue(id, data);
        return { success: true };
      }),

    delete: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        await db.deleteCompanyValue(input.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;

