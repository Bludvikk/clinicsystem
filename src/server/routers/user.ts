import { router, publicProcedure, protectedProcedure } from "@/server/trpc";
import { registerUserDtoSchema } from "../schema/user";
import { getUsers, postUser } from "../services/user";

export const userRouter = router({
  list: protectedProcedure.query(({ ctx }) => getUsers(ctx)),
  register: publicProcedure
    .input(registerUserDtoSchema)
    .mutation(({ ctx, input }) => postUser(ctx, input)),
});
