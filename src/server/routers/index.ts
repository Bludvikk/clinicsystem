import { patientRouter } from "./patient";
import { router } from "../trpc";
import { referenceRouter } from "./reference";
import { entityRouter } from "./entity";
import { userRouter } from "./user";

export const ServerRouter = router({
  user: userRouter,
  patient: patientRouter,
  reference: referenceRouter,
  entity: entityRouter,
});

export type ServerRouter = typeof ServerRouter;
export type RouterKeyType = keyof Omit<
  typeof ServerRouter,
  "index" | "_def" | "createCaller" | "getErrorShape"
>;
