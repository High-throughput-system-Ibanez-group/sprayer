import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const areasRouter = createTRPCRouter({
  save: publicProcedure
    .input(
      z.object({
        id: z.number().optional(),
        x1: z.number(),
        y1: z.number(),
        z1: z.number(),
        x2: z.number(),
        y2: z.number(),
        z2: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // update or create area based on id
      if (input.id) {
        return await ctx.prisma.area.update({
          where: {
            id: input.id,
          },
          data: {
            ...input,
          },
        });
      }
      return await ctx.prisma.area.create({
        data: {
          ...input,
        },
      });
    }),
  delete: publicProcedure.input(z.number()).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.area.delete({
      where: {
        id: input,
      },
    });
  }),
  getAll: publicProcedure.query(
    async ({ ctx }) => await ctx.prisma.area.findMany()
  ),
  getAreaPattern: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.pattern.findFirst({
        where: {
          areaId: input,
        },
      });
    }),
  savePattern: publicProcedure
    .input(
      z.object({
        areaId: z.number(),
        patternId: z.number().optional(),
        points: z.array(z.array(z.number())),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.patternId) {
        return await ctx.prisma.pattern.update({
          where: {
            id: input.patternId,
          },
          data: {
            points: input.points.join("-"),
          },
        });
      }
      return await ctx.prisma.pattern.create({
        data: {
          areaId: input.areaId,
          points: input.points.join("-"),
        },
      });
    }),
});
