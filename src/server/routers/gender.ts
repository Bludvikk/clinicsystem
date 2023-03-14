import { router, publicProcedure } from "@/server/trpc";
import { getGenderSchema } from "../schema/gender";
import { getGender, getGenders } from "../services/gender";

export const genderRouter = router({
  list: publicProcedure.query(async ({ ctx }) => getGenders(ctx)),
  record: publicProcedure
    .input(getGenderSchema)
    .query(async ({ ctx, input }) => getGender(ctx, input)),
});
