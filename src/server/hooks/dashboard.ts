import { trpc } from '@/utils/trpc';

export const getReferenceStatistics = () => {
  const result = trpc.dashboard.Reference.useQuery();
  return result;
};

export const getUserStatistics = () => {
  const result = trpc.dashboard.user.useQuery();
  return result;
};

export const getPatientStatistics = () => {
  const result = trpc.dashboard.patient.useQuery();
  return result;
};

export const getClinicStatistics = () => {
  const result = trpc.dashboard.clinic.useQuery();
  return result;
};

export const getCheckupStatistics = () => {
  const result = trpc.dashboard.checkup.useQuery();
  return result;
};
