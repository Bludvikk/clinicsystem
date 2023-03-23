import { TRPCError } from "@trpc/server";
import { Context } from "@/server/context";
import { Prisma as prismaCli } from "@prisma/client";

import {
  IAddReference,
  IGetReference,
  IGetReferencesByEntityId,
  IDeleteReferenceSchema,
  IUpdateReference,
} from "@/server/schema/reference";

export type ReferencesAsyncType = Awaited<
  ReturnType<typeof getReferences>
>[number];

export const getReferences = async (
  ctx: Context,
  input: IGetReferencesByEntityId
) => {
  try {
    const { entities } = input;

    return await ctx.prisma.reference.findMany({
      where: {
        entityId: { in: entities },
      },
    });
  } catch (err) {
    throw err;
  }
};

export const getReference = async (ctx: Context, input: IGetReference) => {
  try {
    return await ctx.prisma.reference.findUnique({ where: { ...input } });
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

export const postReference = async (ctx: Context, input: IAddReference) => {
  try {
    return {
      data: await ctx.prisma.reference.create({ data: { ...input } }),
      message: "Reference added successfully.",
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

export const putReference = async (ctx: Context, input: IUpdateReference) => {
  try {
    const { id, ...data } = input;

    return {
      data: await ctx.prisma.reference.update({ where: { id }, data }),
      message: "Reference updated successfully.",
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

export const deleteReference = async (
  ctx: Context,
  input: IDeleteReferenceSchema
) => {
  try {
    return {
      data: await ctx.prisma.reference.delete({ where: { ...input } }),
      message: "Reference removed successfully.",
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
