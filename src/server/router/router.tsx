import {router, publicProcedure } from "../trpc";
import { hash } from "argon2";
import { TRPCError } from "@trpc/server";


import { z } from "zod";


export const ServerRouter = router({
  signup: publicProcedure.input(
    z.object({
      username: z.string(),
      email: z.string().email(),
      password: z.string()
    })).mutation(async ({ input, ctx }) => {
    const { username, email, password } = input;

    const exists = await ctx.prisma.user.findFirst({
      where: { email },
    });

    if (exists) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "User already exists.",
      });
    }

    const hashedPassword = await hash(password);

    const result = await ctx.prisma.user.create({
      data: { username, email, password: hashedPassword },
    });

    return {
      status: 201,
      message: "Account created successfully",
      result: result.email,
    };
  }),
  viewAll: publicProcedure.query(async ({ ctx }) => {
    const res = await ctx.prisma.patient.findMany();
    return res;
  }),
  // ADDPATIENT
  // Delete
  // Update
});

export type ServerRouter = typeof ServerRouter;