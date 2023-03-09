import { Context } from "./context";
import { initTRPC } from "@trpc/server";
import superjson from "superjson";

const t = initTRPC.context<Context>().create({ transformer: superjson });

// router
export const router = t.router;

// procedure
export const publicProcedure = t.procedure;
