import { trpc, queryClient } from "@/utils/trpc";
import type {
  IGetPatient,
  IGetPhysicalCheckup,
  IGetPhysicalCheckupsByPatientId,
  IGetVitalSignsById,
  IGetVitalSignsByPhysicianId,
} from "@/server/schema/patient";
import { getQueryKey } from "@trpc/react-query";

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
      queryClient.setQueryData(
        getQueryKey(trpc.patient.record, { id: data.id }, "query"),
        data
      ); // manually updating the cache
      queryClient.invalidateQueries({
        queryKey: getQueryKey(trpc.patient.list, undefined, "query"),
      }); // invalidate query
    },
  });
  return mutation;
};

export const putPatient = () => {
  const mutation = trpc.patient.put.useMutation({
    onSuccess: ({ data }) => {
      queryClient.setQueryData(
        getQueryKey(trpc.patient.record, { id: data.id }, "query"),
        data
      ); // manually updating the cache
      queryClient.invalidateQueries({
        queryKey: getQueryKey(trpc.patient.list, undefined, "query"),
      }); // invalidate query
    },
  });
  return mutation;
};

export const deletePatient = () => {
  const mutation = trpc.patient.delete.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getQueryKey(trpc.patient.list, undefined, "query"),
      });
    },
  });
  return mutation;
};

export const getPhysicalCheckups = ({
  patientId,
}: IGetPhysicalCheckupsByPatientId) => {
  const result = trpc.patient.physicalCheckup.list.useQuery(
    { patientId },
    { enabled: !!patientId, staleTime: Infinity }
  );
  return result;
};

export const getPhysicalCheckup = ({ id }: IGetPhysicalCheckup) => {
  const result = trpc.patient.physicalCheckup.record.useQuery(
    { id },
    { enabled: !!id, staleTime: Infinity }
  );
  return result;
};

export const postPhysicalCheckup = () => {
  const mutations = trpc.patient.physicalCheckup.post.useMutation({
    onSuccess: ({ data }) => {
      queryClient.setQueryData(
        getQueryKey(
          trpc.patient.physicalCheckup.record,
          { id: data.id },
          "query"
        ),
        data
      );
      queryClient.invalidateQueries(
        getQueryKey(
          trpc.patient.physicalCheckup.list,
          { patientId: data.patientId },
          "query"
        )
      );
    },
  });

  return mutations;
};

export const getVitalSignsToday = () => {
  const result = trpc.patient.vitalSigns.listToday.useQuery(undefined, {
    staleTime: Infinity,
  });
  return result;
};

export const getVitalSignsByPhysicianIdToday = ({
  physicianId,
}: IGetVitalSignsByPhysicianId) => {
  const result = trpc.patient.vitalSigns.listByPhysicianIdToday.useQuery(
    { physicianId },
    {
      enabled: !!physicianId,
      staleTime: Infinity,
    }
  );
  return result;
};

export const getVitalSignsById = ({ id }: IGetVitalSignsById) => {
  const result = trpc.patient.vitalSigns.record.useQuery(
    { id },
    {
      enabled: !!id,
      staleTime: Infinity,
    }
  );
  return result;
};

export const postVitalSign = () => {
  const mutation = trpc.patient.vitalSigns.post.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getQueryKey(
          trpc.patient.vitalSigns.listToday,
          undefined,
          "query"
        ),
      });

      queryClient.invalidateQueries({
        queryKey: getQueryKey(
          trpc.patient.vitalSigns.listByPhysicianIdToday,
          undefined,
          "query"
        ),
      });
    },
  });
  return mutation;
};
