import { TRPCError } from "@trpc/server";
import { Context } from "@/server/context";
import { Prisma as prismaCli } from "@prisma/client";
import {
  IAddEntity,
  IDeleteEntity,
  IGetEntity,
  IUpdateEntity,
} from "../schema/entity";

export type EntitiesAsyncType = Awaited<ReturnType<typeof getEntities>>[number];

export const getEntities = async (ctx: Context) => {
  try {
    return await ctx.prisma.entity.findMany({
      include: {
        parent: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
    });
  } catch (err) {
    throw err;
  }
};

export const getEntity = async (ctx: Context, input: IGetEntity) => {
  try {
    return await ctx.prisma.entity.findUnique({ where: { ...input } });
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

export const postEntity = async (ctx: Context, input: IAddEntity) => {
  try {
    return {
      data: await ctx.prisma.entity.create({ data: { ...input } }),
      message: "Entity added successfully.",
      status: "success",
    };
  } catch (err) {
    if (err instanceof prismaCli.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Record already exist.",
          cause: err,
        });
      }
    }
    throw err;
  }
};

export const putEntity = async (ctx: Context, input: IUpdateEntity) => {
  try {
    const { id, ...data } = input;

    return {
      data: await ctx.prisma.entity.update({ where: { id }, data }),
      message: "Entity updated successfully.",
      status: "success",
    };
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

export const deleteEntity = async (ctx: Context, input: IDeleteEntity) => {
  try {
    return {
      data: await ctx.prisma.entity.delete({ where: { ...input } }),
      message: "Entity removed successfully.",
      status: "success",
    };
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