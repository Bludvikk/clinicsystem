import { router, publicProcedure } from '../trpc';
import { patientRouter } from './patient';
import { referenceRouter } from './reference';
import { entityRouter } from './entity';
import { userRouter } from './user';
import { checkupRouter } from './checkup';

export const ServerRouter = router({
  entity: entityRouter,
  reference: referenceRouter,
  user: userRouter,
  patient: patientRouter,
  checkup: checkupRouter
});

export type ServerRouter = typeof ServerRouter;
export type RouterKeyType = keyof Omit<typeof ServerRouter, 'index' | '_def' | 'createCaller' | 'getErrorShape'>;
