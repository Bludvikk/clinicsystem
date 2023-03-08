import { Context } from "./context";
import { initTRPC, TRPCError } from "@trpc/server";

const t = initTRPC.context<Context>().create({});

// router
export const router = t.router;

// procedure
export const publicProcedure = t.procedure;
