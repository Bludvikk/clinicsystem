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
  list: publicProcedure.query(async ({ ctx }) => getPatients(ctx)),
  record: publicProcedure
    .input(getPatientSchema)
    .query(async ({ ctx, input }) => getPatient(ctx, input)),
  post: publicProcedure
    .input(addPatientSchema)
    .mutation(async ({ ctx, input }) => postPatient(ctx, input)),
  put: publicProcedure
    .input(updatePatientSchema)
    .mutation(async ({ ctx, input }) => putPatient(ctx, input)),
  delete: publicProcedure
    .input(deletePatientSchema)
    .mutation(async ({ ctx, input }) => deletePatient(ctx, input)),
});
