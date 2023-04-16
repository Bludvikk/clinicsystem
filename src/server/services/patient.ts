import { TRPCError } from "@trpc/server";
import { Context } from "@/server/context";
import { Prisma as prismaCli } from "@prisma/client";

import type {
  IAddPatient,
  IAddPhysicalCheckup,
  IAddVitalSign,
  IDeletePatient,
  IGetPatient,
  IGetPhysicalCheckup,
  IGetPhysicalCheckupsByPatientId,
  IGetVitalSignsById,
  IGetVitalSignsByPhysicianId,
  IUpdatePatient,
} from "@/server/schema/patient";
import moment from "moment";

export type PatientsAsyncType = typeof getPatients;
export type PhysicalCheckupsAsyncType = typeof getPhysicalCheckups;
export type VitalSignAsyncType = typeof getVitalSignsToday;

export const getPatients = async (ctx: Context) => {
  try {
    return await ctx.prisma.patient.findMany({
      include: {
        civilStatus: true,
        gender: true,
        occupation: true,
      },
    });
  } catch (err) {
    throw err;
  }
};

export const getPatient = async (ctx: Context, input: IGetPatient) => {
  try {
    return await ctx.prisma.patient.findUnique({
      where: { ...input },
      include: {
        civilStatus: true,
        gender: true,
        occupation: true,
      },
    });
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

export const postPatient = async (ctx: Context, input: IAddPatient) => {
  try {
    const {
      firstName,
      lastName,
      middleInitial,
      address,
      dateOfBirth,
      civilStatusId,
      age,
      occupationId,
      genderId,
      contactNumber,
      familyHistory,
      personalHistory,
      pastMedicalHistory,
      obGyne,
    } = input;

    return {
      data: await ctx.prisma.patient.create({
        data: {
          firstName,
          lastName,
          middleInitial,
          address,
          dateOfBirth,
          civilStatusId,
          age,
          occupationId,
          genderId,
          contactNumber,
          familyHistory,
          personalHistory,
          pastMedicalHistory,
          obGyne: JSON.parse(JSON.stringify(obGyne)),
        },
        include: {
          civilStatus: true,
          gender: true,
          occupation: true,
        },
      }),
      message: "Patient added successfully.",
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

export const putPatient = async (ctx: Context, input: IUpdatePatient) => {
  try {
    const { id, ...data } = input;

    return {
      data: await ctx.prisma.patient.update({
        where: { id },
        data: JSON.parse(JSON.stringify(data)),
        include: {
          civilStatus: true,
          gender: true,
          occupation: true,
        },
      }),
      message: "Patient updated successfully.",
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

export const deletePatient = async (ctx: Context, input: IDeletePatient) => {
  try {
    return {
      data: await ctx.prisma.patient.delete({
        where: { ...input },
      }),
      message: "Patient removed successfully.",
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

export const getPhysicalCheckups = async (
  ctx: Context,
  input: IGetPhysicalCheckupsByPatientId
) => {
  try {
    return await ctx.prisma.physicalCheckup.findMany({
      where: { ...input },
      include: {
        patient: true,
        physician: true,
      },
    });
  } catch (err) {
    throw err;
  }
};

export const getPhysicalCheckup = async (
  ctx: Context,
  input: IGetPhysicalCheckup
) => {
  try {
    return await ctx.prisma.physicalCheckup.findUnique({
      where: { ...input },
      include: {
        patient: true,
        physician: true,
      },
    });
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

export const postPhysicalCheckup = async (
  ctx: Context,
  input: IAddPhysicalCheckup
) => {
  try {
    return {
      data: await ctx.prisma.physicalCheckup.create({
        data: { ...input },
        include: {
          patient: true,
          physician: true,
        },
      }),
      message: "Physical checkup record created successfully.",
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

export const getVitalSignsToday = async (ctx: Context) => {
  try {
    const startOfDay = moment().startOf("day").toDate();
    const endOfDay = moment().endOf("day").toDate();

    return await ctx.prisma.vitalSign.findMany({
      where: {
        createdAt: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
            middleInitial: true,
          },
        },
        physician: {
          select: {
            firstName: true,
            lastName: true,
            middleInitial: true,
          },
        },
        receptionist: {
          select: {
            firstName: true,
            lastName: true,
            middleInitial: true,
          },
        },
      },
    });
  } catch (err) {
    throw err;
  }
};

export const getVitalSignsByPhysicianIdToday = async (
  ctx: Context,
  input: IGetVitalSignsByPhysicianId
) => {
  try {
    const startOfDay = moment().startOf("day").toDate();
    const endOfDay = moment().endOf("day").toDate();

    return await ctx.prisma.vitalSign.findMany({
      where: {
        AND: [
          { ...input },
          {
            createdAt: {
              gte: startOfDay,
              lt: endOfDay,
            },
          },
        ],
      },
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
            middleInitial: true,
          },
        },
        physician: {
          select: {
            firstName: true,
            lastName: true,
            middleInitial: true,
          },
        },
        receptionist: {
          select: {
            firstName: true,
            lastName: true,
            middleInitial: true,
          },
        },
      },
    });
  } catch (err) {
    throw err;
  }
};

export const getVitalSignsById = async (
  ctx: Context,
  input: IGetVitalSignsById
) => {
  try {
    return await ctx.prisma.vitalSign.findUnique({
      where: { ...input },
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
            middleInitial: true,
          },
        },
        physician: {
          select: {
            firstName: true,
            lastName: true,
            middleInitial: true,
          },
        },
        receptionist: {
          select: {
            firstName: true,
            lastName: true,
            middleInitial: true,
          },
        },
      },
    });
  } catch (err) {
    throw err;
  }
};

export const postVitalSign = async (ctx: Context, input: IAddVitalSign) => {
  try {
    return {
      data: await ctx.prisma.vitalSign.create({
        data: { ...input },
      }),
      message: "Vital Signs Added Successfully.",
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
