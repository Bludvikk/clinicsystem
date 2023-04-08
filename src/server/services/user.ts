import { TRPCError } from "@trpc/server";
import { Context } from "@/server/context";
import { Prisma as prismaCli } from "@prisma/client";
import { RegisterUserDtoSchemaType } from "../schema/user";
import { hash } from "argon2";

export type UsersAsyncType = typeof getUsers;

export const getUsers = async (ctx: Context) => {
  try {
    return await ctx.prisma.user.findMany({
      include: {
        role: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
        department: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
        status: {
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

export const postUser = async (
  ctx: Context,
  input: RegisterUserDtoSchemaType
) => {
  try {
    const { terms, ...data } = input;

    const hashedPassword = await hash(input.password);
    await ctx.prisma.user.create({
      data: { ...data, password: hashedPassword },
    });

    return {
      message: "User created successfully.",
      status: "success",
    };
  } catch (err) {
    if (err instanceof prismaCli.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exist.",
          cause: err,
        });
      }
    }
    throw err;
  }
};
