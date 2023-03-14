import { trpc } from "@/utils/trpc";
import type { IGetPatient } from "@/server/schema/patient";

export const getPatients = () => {
  const result = trpc.patient.list.useQuery();
  return result;
};

export const getPatient = ({ id }: IGetPatient) => {
  const result = trpc.patient.record.useQuery({ id });
  return result;
};

export const postPatient = () => {
  const mutation = trpc.patient.post.useMutation();
  return mutation;
};

export const putPatient = () => {
  const mutation = trpc.patient.put.useMutation();
  return mutation;
};

export const deletePatient = () => {
  const mutation = trpc.patient.delete.useMutation();
  return mutation;
};
