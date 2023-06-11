import { router, protectedProcedure } from '@/server/trpc';
import {
  getCheckupStatistics,
  getClinicStatistics,
  getReferenceStatistics,
  getUserStatistics,
  patientStatistics
} from '../services/dashboard';

export const dashboardRouter = router({
  user: protectedProcedure.query(({ ctx }) => getUserStatistics(ctx)),
  patient: protectedProcedure.query(({ ctx }) => patientStatistics(ctx)),
  clinic: protectedProcedure.query(({ ctx }) => getClinicStatistics(ctx)),
  checkup: protectedProcedure.query(({ ctx }) => getCheckupStatistics(ctx)),
  Reference: protectedProcedure.query(({ ctx }) => getReferenceStatistics(ctx))
});
