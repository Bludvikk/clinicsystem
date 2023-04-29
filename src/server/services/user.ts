import { TRPCError } from '@trpc/server';
import { Context } from '@/server/context';
import { Prisma as prismaCli } from '@prisma/client';
import { ParamsInput } from '@/utils/common.type';
import { hash } from 'argon2';
import { PostUserDtoType } from '../schema/user';
import { RecordDoesExist } from '@/utils/http.message';

export type UsersAsyncType = typeof getUsers;

export const getUsers = async (ctx: Context) => {
  try {
    return await ctx.prisma.user.findMany({
      include: {
        role: {
          select: {
            id: true,
            code: true,
            name: true
          }
        },
        department: {
          select: {
            id: true,
            code: true,
            name: true
          }
        },
        status: {
          select: {
            id: true,
            code: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  } catch (err) {
    throw err;
  }
};

export const postUser = async (ctx: Context, postUserDto: PostUserDtoType) => {
  try {
    const { params, body } = postUserDto;

    const hashedPassword = await hash(body.password);

    // ** UPDATE data
    if (params.id) {
      let isPasswordMatch = false;
      const user = await ctx.prisma.user.findUnique({
        where: { id: params.id }
      });

      if (user) isPasswordMatch = user.password === body.password;

      if (isPasswordMatch) {
        return {
          data: await ctx.prisma.user.update({
            where: { id: params.id },
            data: body
          }),
          message: 'User updated successfully.',
          status: 'success'
        };
      } else {
        return {
          data: await ctx.prisma.user.update({
            where: { id: params.id },
            data: { ...body, password: hashedPassword }
          }),
          message: 'User updated successfully.',
          status: 'success'
        };
      }
    }

    return {
      data: await ctx.prisma.user.create({
        data: { ...body, password: hashedPassword }
      }),
      message: 'User created successfully.',
      status: 'success'
    };
  } catch (err) {
    if (err instanceof prismaCli.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        throw new RecordDoesExist({
          module: postUserDto.params.module,
          code: 'email or username'
        });
      }
    }
    throw err;
  }
};

export const deleteUser = async (ctx: Context, params: ParamsInput) => {
  try {
    await ctx.prisma.user.delete({ where: { id: params.id } });

    return {
      id: params.id,
      message: 'User deleted successfully.',
      status: 'success'
    };
  } catch (err) {
    if (err instanceof prismaCli.PrismaClientKnownRequestError) {
      if (err.code === 'P2025') {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Record ID <<${params.id}>> not found.`
        });
      }
    }
    throw err;
  }
};
