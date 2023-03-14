import { TRPCError } from "@trpc/server";
import { Context } from "@/server/context";
import { IGetCivilStatus } from "../schema/civilStatus";
import { Prisma as prismaCli } from "@prisma/client";

export const getCivilStatuses = async (ctx: Context) => {
  try {
    const res = await ctx.prisma.civilStatus.findMany();
    return res;
  } catch (err) {
    throw err;
  }
};

export const getCivilStatus = async (ctx: Context, input: IGetCivilStatus) => {
  try {
    const { id } = input;
    const res = await ctx.prisma.civilStatus.findUnique({
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
