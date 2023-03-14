import { TRPCError } from "@trpc/server";
import { hash } from "argon2";

import { signUpSchema } from "../../common/validation/auth";
import { patientRouter } from "./patient";
import { router, publicProcedure } from "../trpc";
import { civilStatusRouter } from "./civilStatus";
import { occupationRouter } from "./occupation";
import { genderRouter } from "./gender";

export const ServerRouter = router({
  signup: publicProcedure.input(signUpSchema).mutation(async ({ input, ctx }) => {
    const { username, email, password } = input;

    const exists = await ctx.prisma.user.findFirst({
      where: { email },
    });

    if (exists) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "User already exists.",
      });
    }

    const hashedPassword = await hash(password);

    const result = await ctx.prisma.user.create({
      data: { username, email, password: hashedPassword },
    });

    return {
      status: 201,
      message: "Account created successfully",
      result: result.email,
    };
  }),
  patient: patientRouter,
  gender: genderRouter,
  civilStatus: civilStatusRouter,
  occupation: occupationRouter,
});

export type ServerRouter = typeof ServerRouter;
