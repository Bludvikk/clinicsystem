import { router, publicProcedure } from "@/server/trpc";
import { getCivilStatusSchema } from "../schema/civilStatus";
import { getCivilStatus, getCivilStatuses } from "../services/civilStatus";

export const civilStatusRouter = router({
  list: publicProcedure.query(async ({ ctx }) => getCivilStatuses(ctx)),
  record: publicProcedure
    .input(getCivilStatusSchema)
    .query(async ({ ctx, input }) => getCivilStatus(ctx, input)),
});
