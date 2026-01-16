
import { inngest } from '@/inngest/client';
import {createTRPCRouter, protectedProcedure } from '../init';
import prisma from '@/lib/db';
import { workFlowsRouter } from '@/features/workflows/server/routers';

export const appRouter = createTRPCRouter({
  workflows: workFlowsRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;