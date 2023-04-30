import { createTRPCRouter } from "~/server/api/trpc";
import { areasRouter } from "~/server/api/routers/areas";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  areas: areasRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
