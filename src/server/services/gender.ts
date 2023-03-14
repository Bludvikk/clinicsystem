import { TRPCError } from "@trpc/server";
import { Context } from "@/server/context";
import { IGetGender } from "../schema/gender";
import { Prisma as prismaCli } from "@prisma/client";

export const getGenders = async (ctx: Context) => {
  try {
    const res = await ctx.prisma.gender.findMany();
    return res;
  } catch (err) {
    throw err;
  }
};

export const getGender = async (ctx: Context, input: IGetGender) => {
  try {
    const { id } = input;
    const res = await ctx.prisma.gender.findUnique({
      where: { id },
    });

    return res;
  } catch (err) {
    if (err instanceof prismaCli.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Record not found.",
          cause: err,
        });
      }
    }
    throw err;
  }
};
