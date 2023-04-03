import { router, protectedProcedure } from "@/server/trpc";
import {
  addEntitySchema,
  deleteEntitySchema,
  getEntitySchema,
  updateEntitySchema,
} from "../schema/entity";
import {
  deleteEntity,
  getEntities,
  getEntity,
  postEntity,
  putEntity,
} from "../services/entity";

export const entityRouter = router({
  list: protectedProcedure.query(({ ctx }) => getEntities(ctx)),
  record: protectedProcedure
    .input(getEntitySchema)
    .query(({ ctx, input }) => getEntity(ctx, input)),
  post: protectedProcedure
    .input(addEntitySchema)
    .mutation(({ ctx, input }) => postEntity(ctx, input)),
  put: protectedProcedure
    .input(updateEntitySchema)
    .mutation(({ ctx, input }) => putEntity(ctx, input)),
  delete: protectedProcedure
    .input(deleteEntitySchema)
    .mutation(({ ctx, input }) => deleteEntity(ctx, input)),
});
