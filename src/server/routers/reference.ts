import { router, protectedProcedure, publicProcedure } from "@/server/trpc";

import {
  addReferenceSchema,
  getReferenceSchema,
  getReferencesByEntityIdSchema,
  updateReferenceSchema,
  deleteReferenceSchema,
} from "@/server/schema/reference";

import {
  getReferences,
  getReference,
  postReference,
  deleteReference,
  putReference,
} from "@/server/services/reference";

export const referenceRouter = router({
  list: publicProcedure
    .input(getReferencesByEntityIdSchema)
    .query(({ ctx, input }) => getReferences(ctx, input)),
  record: protectedProcedure
    .input(getReferenceSchema)
    .query(({ ctx, input }) => getReference(ctx, input)),
  post: protectedProcedure
    .input(addReferenceSchema)
    .mutation(({ ctx, input }) => postReference(ctx, input)),
  put: protectedProcedure
    .input(updateReferenceSchema)
    .mutation(({ ctx, input }) => putReference(ctx, input)),
  delete: protectedProcedure
    .input(deleteReferenceSchema)
    .mutation(({ ctx, input }) => deleteReference(ctx, input)),
});
