import { trpc, queryClient } from "@/utils/trpc";
import type { IGetPatient } from "@/server/schema/patient";
import { getQueryKey } from "@trpc/react-query";

const patientListQueryKey = getQueryKey(trpc.patient.list, undefined, "query");

export const getPatients = () => {
  const result = trpc.patient.list.useQuery(undefined, { staleTime: Infinity });
  return result;
};

export const getPatient = ({ id }: IGetPatient) => {
  const result = trpc.patient.record.useQuery(
    { id },
    { enabled: !!id, staleTime: Infinity }
  );
  return result;
};

export const postPatient = () => {
  const mutation = trpc.patient.post.useMutation({
    onSuccess: ({ data }) => {
      const patientRecordQueryKey = getQueryKey(
        trpc.patient.record,
        { id: data.id },
        "query"
      );

      queryClient.setQueryData(patientRecordQueryKey, data); // manually updating the cache
      queryClient.invalidateQueries({
        queryKey: patientListQueryKey,
      }); // invalidate query
    },
  });
  return mutation;
};

export const putPatient = () => {
  const mutation = trpc.patient.put.useMutation({
    onSuccess: ({ data }) => {
      const patientRecordQueryKey = getQueryKey(
        trpc.patient.record,
        { id: data.id },
        "query"
      );

      queryClient.setQueryData(patientRecordQueryKey, data); // manually updating the cache
      queryClient.invalidateQueries({
        queryKey: patientListQueryKey,
      }); // invalidate query
    },
  });
  return mutation;
};

export const deletePatient = () => {
  const mutation = trpc.patient.delete.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: patientListQueryKey,
      });
    },
  });
  return mutation;
};
