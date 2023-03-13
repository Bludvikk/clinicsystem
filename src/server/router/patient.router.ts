import { router, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import {
  addPatientSchema,
  deletePatientSchema,
  getPatientSchema,
  updatePatientSchema,
} from "@/common/validation/patient";

export const patientRouter = router({
  getPatients: publicProcedure.query(async ({ ctx }) => {
    try {
      const res = await ctx.prisma.patient.findMany({
        include: {
          familyHistory: true,
          personalHistory: true,
          pastMedicalHistory: true,
          obGyne: true,
        },
      });
      return res;
    } catch (err) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal server error occured, please try again later",
        cause: err,
      });
    }
  }),

  getPatient: publicProcedure
    .input(getPatientSchema)
    .query(async ({ ctx, input }) => {
      try {
        const { id } = input;
        const res = await ctx.prisma.patient.findUnique({
          where: {
            id,
          },
          include: {
            familyHistory: true,
            personalHistory: true,
            pastMedicalHistory: true,
            obGyne: true,
          },
        });

        return res;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal server error occured, please try again later",
          cause: err,
        });
      }
    }),

  addPatient: publicProcedure
    .input(addPatientSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const {
          firstName,
          lastName,
          middleInitial,
          address,
          dateOfBirth,
          civilStatus,
          age,
          occupation,
          gender,
          contactNumber,
          isBronchialAsthma,
          isPulmonaryTuberculosis,
          isHypertension,
          isDiabetesMellitus,
          isHearthDisease,
          isCancer,
          familyHistoryOthers,
          isSmoking,
          isAlcohol,
          currentHealthCondition,
          medications,
          isHospitalized,
          isInjuries,
          isSurgeries,
          isAllergies,
          isMeasles,
          isChickenPox,
          PastMedicalHistoryOthers,
          menstrualCycle,
          days,
        } = input;

        const res = await ctx.prisma.patient.create({
          data: {
            firstName,
            lastName,
            middleInitial,
            address,
            dateOfBirth,
            civilStatus,
            age,
            occupation,
            gender,
            contactNumber,
            familyHistory: {
              create: {
                isBronchialAsthma,
                isPulmonaryTuberculosis,
                isHypertension,
                isDiabetesMellitus,
                isHearthDisease,
                isCancer,
                others: familyHistoryOthers,
              },
            },
            personalHistory: {
              create: {
                isSmoking,
                isAlcohol,
                currentHealthCondition,
                medications,
              },
            },
            pastMedicalHistory: {
              create: {
                isHospitalized,
                isInjuries,
                isSurgeries,
                isAllergies,
                isMeasles,
                isChickenPox,
                others: PastMedicalHistoryOthers,
              },
            },
            obGyne: {
              create: {
                menstrualCycle,
                days,
              },
            },
          },
          include: {
            familyHistory: true,
            personalHistory: true,
            pastMedicalHistory: true,
            obGyne: true,
          },
        });

        return {
          data: res,
          message: "Patient added successfully.",
        };
      } catch (err) {
        if (err instanceof TRPCError) {
          const httpCode = getHTTPStatusCodeFromError(err);
          if (httpCode === 500) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Internal server error occurred, please try again later",
              cause: err,
            });
          } else {
            throw err;
          }
        }
      }
    }),

  updatePatient: publicProcedure
    .input(updatePatientSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const {
          id,
          firstName,
          lastName,
          middleInitial,
          address,
          dateOfBirth,
          civilStatus,
          age,
          occupation,
          gender,
          contactNumber,
          isBronchialAsthma,
          isPulmonaryTuberculosis,
          isHypertension,
          isDiabetesMellitus,
          isHearthDisease,
          isCancer,
          familyHistoryOthers,
          isSmoking,
          isAlcohol,
          currentHealthCondition,
          medications,
          isHospitalized,
          isInjuries,
          isSurgeries,
          isAllergies,
          isMeasles,
          isChickenPox,
          PastMedicalHistoryOthers,
          menstrualCycle,
          days,
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
            civilStatus,
            age,
            occupation,
            gender,
            contactNumber,
            familyHistory: {
              update: {
                isBronchialAsthma,
                isPulmonaryTuberculosis,
                isHypertension,
                isDiabetesMellitus,
                isHearthDisease,
                isCancer,
                others: familyHistoryOthers,
              },
            },
            personalHistory: {
              update: {
                isSmoking,
                isAlcohol,
                currentHealthCondition,
                medications,
              },
            },
            pastMedicalHistory: {
              update: {
                isHospitalized,
                isInjuries,
                isSurgeries,
                isAllergies,
                isMeasles,
                isChickenPox,
                others: PastMedicalHistoryOthers,
              },
            },
            obGyne: {
              update: {
                menstrualCycle,
                days,
              },
            },
          },
          include: {
            familyHistory: true,
            personalHistory: true,
            pastMedicalHistory: true,
            obGyne: true,
          },
        });

        return {
          data: res,
          message: "Patient updated successfully.",
        };
      } catch (err) {}
    }),

  deletePatient: publicProcedure
    .input(deletePatientSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { id } = input;
        const res = await ctx.prisma.patient.delete({
          where: {
            id,
          },
          include: {
            familyHistory: true,
            personalHistory: true,
            pastMedicalHistory: true,
            obGyne: true,
          },
        });

        return {
          data: res,
          message: "Patient removed successfully.",
        };
      } catch (err) {
        if (err instanceof TRPCError) {
          const httpCode = getHTTPStatusCodeFromError(err);
          if (httpCode === 500) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Internal server error occurred, please try again later",
              cause: err,
            });
          } else {
            throw err;
          }
        }
      }
    }),
});
