import { router, publicProcedure } from "@/server/trpc";
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
  // postEntity,
  putEntity,
} from "../services/entity";

export const EntityRouter = router({
  list: publicProcedure.query(({ ctx }) => getEntities(ctx)),
  record: publicProcedure
    .input(getEntitySchema)
    .query(({ ctx, input }) => getEntity(ctx, input)),
  // post: publicProcedure
  //   .input(addEntitySchema)
  //   .mutation(({ ctx, input }) => postEntity(ctx, input)),
  put: publicProcedure
    .input(updateEntitySchema)
    .mutation(({ ctx, input }) => putEntity(ctx, input)),
  delete: publicProcedure
    .input(deleteEntitySchema)
    .mutation(({ ctx, input }) => deleteEntity(ctx, input)),
});
