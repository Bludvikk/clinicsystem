import { TRPCError } from "@trpc/server";
import { Context } from "@/server/context";
import { Prisma as prismaCli } from "@prisma/client";

import type {
  IAddPatient,
  IAddPhysicalCheckup,
  IDeletePatient,
  IGetPatient,
  IGetPhysicalCheckup,
  IGetPhysicalCheckupsByPatientId,
  IUpdatePatient,
} from "@/server/schema/patient";

export type PatientsAsyncType = ReturnType<typeof getPatients>;
export type PhysicalCheckupAsyncType = ReturnType<typeof getPhysicalCheckups>;

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

export const getPhysicians = async (ctx: Context) => {
  try {
    return await ctx.prisma.physician.findMany({
      include: {
        civilStatus: true,
        gender: true,
      },
    });
  } catch (err) {
    throw err;
  }
};
