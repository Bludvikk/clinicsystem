import { router, publicProcedure } from "@/server/trpc";
import { getOccupationSchema } from "../schema/occupation";
import { getOccupation, getOccupations } from "../services/occupation";

export const occupationRouter = router({
  list: publicProcedure.query(async ({ ctx }) => getOccupations(ctx)),
  record: publicProcedure
    .input(getOccupationSchema)
    .query(async ({ ctx, input }) => getOccupation(ctx, input)),
});
