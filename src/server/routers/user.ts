import { router, protectedProcedure } from "@/server/trpc";
import { filterQuery, params } from "../schema/common";
import { deleteUser, getUsers, postUser } from "../services/user";
import { postUserDtoSchema } from "../schema/user";

export const userRouter = router({
  list: protectedProcedure.input(filterQuery).query(({ ctx }) => getUsers(ctx)),
  post: protectedProcedure
    .input(postUserDtoSchema)
    .mutation(({ ctx, input }) => postUser(ctx, input)),
  delete: protectedProcedure
    .input(params)
    .mutation(({ ctx, input }) => deleteUser(ctx, input)),
});
