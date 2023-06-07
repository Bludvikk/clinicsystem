import { TRPCError } from '@trpc/server';
import { Context } from '@/server/context';
import { Prisma as prismaCli } from '@prisma/client';
import { FilterQueryInputType, ParamsInput } from '@/utils/common.type';
import { hash } from 'argon2';
import { PostUserDtoSchemaType } from '../schema/user';
import { RecordDoesExist } from '@/utils/http.message';
import _ from 'lodash';

export type UsersAsyncType = typeof getUsers;

export const getUsers = async (ctx: Context, filterQuery?: FilterQueryInputType) => {
  try {
    return await ctx.prisma.user.findMany({
      ...(filterQuery && filterQuery.ids ? { where: { id: { in: filterQuery.ids } } } : {}),
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
        },
        profile: {
          include: {
            physicianProfile: {
              include: {
                clinics: true
              }
            },
            receptionistProfile: {
              include: {
                clinics: true
              }
            }
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

export const postUser = async (ctx: Context, postUserDto: PostUserDtoSchemaType) => {
  try {
    const { params, body } = postUserDto;

    const { physicianProfile, receptionistProfile, ...userData } = body;

    const hashedPassword = await hash(body.password);

    // ** UPDATE data
    if (params.id) {
      let isPasswordMatch = false;

      const user = await ctx.prisma.user.findUnique({
        where: { id: params.id },
        include: {
          profile: {
            include: {
              physicianProfile: {
                include: {
                  clinics: true
                }
              },
              receptionistProfile: {
                include: {
                  clinics: true
                }
              }
            }
          }
        }
      });

      if (user) isPasswordMatch = user.password === body.password;

      return {
        data: await ctx.prisma.user.update({
          where: { id: params.id },
          data: {
            ...userData,
            ...(!isPasswordMatch && { password: hashedPassword }),

            ...(!physicianProfile &&
              !receptionistProfile &&
              (user?.profile?.physicianProfile || user?.profile?.receptionistProfile) && {
                profile: {
                  delete: true
                }
              }),

            ...(physicianProfile && {
              profile: {
                ...(user?.profile?.receptionistProfile && {
                  delete: true
                }),
                upsert: {
                  create: {
                    physicianProfile: {
                      create: {
                        ..._.omit(physicianProfile, 'clinics'),
                        clinics: {
                          connect: _.get(physicianProfile, 'clinics').map(id => ({ id }))
                        }
                      }
                    }
                  },
                  update: {
                    physicianProfile: {
                      update: {
                        ..._.omit(physicianProfile, 'clinics'),
                        clinics: {
                          disconnect: user?.profile?.physicianProfile?.clinics?.length
                            ? user?.profile?.physicianProfile?.clinics.map(clinic => ({ id: clinic.id }))
                            : [],
                          connect: _.get(physicianProfile, 'clinics').map(id => ({ id }))
                        }
                      }
                    }
                  }
                }
              }
            }),
            ...(receptionistProfile && {
              profile: {
                ...(user?.profile?.physicianProfile && {
                  delete: true
                }),
                upsert: {
                  create: {
                    receptionistProfile: {
                      create: {
                        ..._.omit(receptionistProfile, 'clinics'),
                        clinics: {
                          connect: _.get(receptionistProfile, 'clinics').map(id => ({ id }))
                        }
                      }
                    }
                  },
                  update: {
                    receptionistProfile: {
                      update: {
                        ..._.omit(receptionistProfile, 'clinics'),
                        clinics: {
                          disconnect: user?.profile?.receptionistProfile?.clinics?.length
                            ? user?.profile?.receptionistProfile?.clinics.map(clinic => ({ id: clinic.id }))
                            : [],
                          connect: _.get(receptionistProfile, 'clinics').map(id => ({ id }))
                        }
                      }
                    }
                  }
                }
              }
            })
          }
        }),
        message: 'User updated successfully.',
        status: 'success'
      };
    }

    return {
      data: await ctx.prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword,
          ...(physicianProfile && {
            profile: {
              create: {
                physicianProfile: {
                  create: {
                    ..._.omit(physicianProfile, 'clinics'),
                    clinics: {
                      connect: _.get(physicianProfile, 'clinics').map(id => ({ id }))
                    }
                  }
                }
              }
            }
          }),
          ...(receptionistProfile && {
            profile: {
              create: {
                receptionistProfile: {
                  create: {
                    ..._.omit(receptionistProfile, 'clinics'),
                    clinics: {
                      connect: _.get(receptionistProfile, 'clinics').map(id => ({ id }))
                    }
                  }
                }
              }
            }
          })
        }
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
