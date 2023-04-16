import { router, protectedProcedure } from "../trpc";

import {
  addPatientSchema,
  deletePatientSchema,
  getPatientSchema,
  updatePatientSchema,
  addPhysicalCheckupSchema,
  getPhysicalCheckupSchema,
  getPhysicalCheckupsByPatientIdSchema,
  addVitalSignSchema,
  getvitalSignsByPhysicianIdSchema,
  getVitalSignsByIdSchema,
} from "@/server/schema/patient";

import {
  deletePatient,
  getPatient,
  getPatients,
  postPatient,
  putPatient,
  getPhysicalCheckups,
  getPhysicalCheckup,
  postPhysicalCheckup,
  getVitalSignsByPhysicianIdToday,
  postVitalSign,
  getVitalSignsToday,
  getVitalSignsById,
} from "../services/patient";

const physicalCheckupRouter = router({
  list: protectedProcedure
    .input(getPhysicalCheckupsByPatientIdSchema)
    .query(({ ctx, input }) => getPhysicalCheckups(ctx, input)),
  record: protectedProcedure
    .input(getPhysicalCheckupSchema)
    .query(({ ctx, input }) => getPhysicalCheckup(ctx, input)),
  post: protectedProcedure
    .input(addPhysicalCheckupSchema)
    .mutation(({ ctx, input }) => postPhysicalCheckup(ctx, input)),
});

const vitalSignsRouter = router({
  listToday: protectedProcedure.query(({ ctx }) => getVitalSignsToday(ctx)),
  listByPhysicianIdToday: protectedProcedure
    .input(getvitalSignsByPhysicianIdSchema)
    .query(({ ctx, input }) => getVitalSignsByPhysicianIdToday(ctx, input)),
  record: protectedProcedure
    .input(getVitalSignsByIdSchema)
    .query(({ ctx, input }) => getVitalSignsById(ctx, input)),
  post: protectedProcedure
    .input(addVitalSignSchema)
    .mutation(({ ctx, input }) => postVitalSign(ctx, input)),
});

export const patientRouter = router({
  list: protectedProcedure.query(({ ctx }) => getPatients(ctx)),
  record: protectedProcedure
    .input(getPatientSchema)
    .query(({ ctx, input }) => getPatient(ctx, input)),
  post: protectedProcedure
    .input(addPatientSchema)
    .mutation(({ ctx, input }) => postPatient(ctx, input)),
  put: protectedProcedure
    .input(updatePatientSchema)
    .mutation(({ ctx, input }) => putPatient(ctx, input)),
  delete: protectedProcedure
    .input(deletePatientSchema)
    .mutation(({ ctx, input }) => deletePatient(ctx, input)),
  physicalCheckup: physicalCheckupRouter,
  vitalSigns: vitalSignsRouter,
});
