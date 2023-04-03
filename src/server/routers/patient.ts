import { router, protectedProcedure } from "../trpc";

import {
  addPatientSchema,
  deletePatientSchema,
  getPatientSchema,
  updatePatientSchema,
  addPhysicalCheckupSchema,
  getPhysicalCheckupSchema,
  getPhysicalCheckupsByPatientIdSchema,
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
  getPhysicians,
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

const physicianRouter = router({
  list: protectedProcedure.query(({ ctx }) => getPhysicians(ctx)),
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
  physicians: physicianRouter,
});
