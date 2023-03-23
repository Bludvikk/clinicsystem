import { router, publicProcedure } from "../trpc";

import {
  addPatientSchema,
  deletePatientSchema,
  getPatientSchema,
  updatePatientSchema,
} from "@/server/schema/patient";

import {
  deletePatient,
  getPatient,
  getPatients,
  postPatient,
  putPatient,
} from "../services/patient";

export const patientRouter = router({
  list: publicProcedure.query(({ ctx }) => getPatients(ctx)),
  record: publicProcedure
    .input(getPatientSchema)
    .query(({ ctx, input }) => getPatient(ctx, input)),
  post: publicProcedure
    .input(addPatientSchema)
    .mutation(({ ctx, input }) => postPatient(ctx, input)),
  put: publicProcedure
    .input(updatePatientSchema)
    .mutation(({ ctx, input }) => putPatient(ctx, input)),
  delete: publicProcedure
    .input(deletePatientSchema)
    .mutation(({ ctx, input }) => deletePatient(ctx, input)),
});
