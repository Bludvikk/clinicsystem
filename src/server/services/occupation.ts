import { TRPCError } from "@trpc/server";
import { Context } from "@/server/context";
import { IGetOccupation } from "../schema/occupation";
import { Prisma as prismaCli } from "@prisma/client";

export const getOccupations = async (ctx: Context) => {
  try {
    const res = await ctx.prisma.occupation.findMany();
    return res;
  } catch (err) {
    throw err;
  }
};

export const getOccupation = async (ctx: Context, input: IGetOccupation) => {
  try {
    const { id } = input;
    const res = await ctx.prisma.occupation.findUnique({
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
