import { TRPCError } from "@trpc/server";
import { Context } from "@/server/context";
import { Prisma as prismaCli } from "@prisma/client";

import type {
  IAddPatient,
  IdeletePatient,
  IGetPatient,
  IUpdatePatient,
} from "@/server/schema/patient";

export const getPatients = async (ctx: Context) => {
  try {
    const res = await ctx.prisma.patient.findMany();
    return res;
  } catch (err) {
    throw err;
  }
};

export const getPatient = async (ctx: Context, input: IGetPatient) => {
  try {
    const { id } = input;
    const res = await ctx.prisma.patient.findUnique({
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

    const res = await ctx.prisma.patient.create({
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
        obGyne,
      },
    });

    return {
      data: res,
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
    const {
      id,
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

    const res = await ctx.prisma.patient.update({
      where: {
        id,
      },
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
        obGyne,
      },
    });

    return {
      data: res,
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

export const deletePatient = async (ctx: Context, input: IdeletePatient) => {
  try {
    const { id } = input;
    const res = await ctx.prisma.patient.delete({
      where: {
        id,
      },
    });

    return {
      data: res,
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
