import { trpc, queryClient } from "@/utils/trpc";
import { IGetReference, IGetReferencesByEntityId } from "../schema/reference";
import { getQueryKey } from "@trpc/react-query";

export const getReferences = ({ entities }: IGetReferencesByEntityId) => {
  const result = trpc.reference.list.useQuery(
    { entities },
    {
      staleTime: Infinity,
    }
  );
  return result;
};

export const getReference = ({ id }: IGetReference) => {
  const result = trpc.reference.record.useQuery(
    { id },
    {
      enabled: !!id,
      staleTime: Infinity,
    }
  );
  return result;
};

export const postReference = ({ entities }: IGetReferencesByEntityId) => {
  const mutation = trpc.reference.post.useMutation({
    onSuccess: ({ data }) => {
      const referenceListQueryKey = getQueryKey(
        trpc.reference.list,
        { entities },
        "query"
      );
      const referenceRecordQueryKey = getQueryKey(
        trpc.reference.record,
        { id: data.id },
        "query"
      );

      queryClient.setQueryData(referenceRecordQueryKey, data); // manually updating the cache
      queryClient.invalidateQueries({ queryKey: referenceListQueryKey }); // invalidate query
    },
  });
  return mutation;
};

export const putReference = ({ entities }: IGetReferencesByEntityId) => {
  const mutation = trpc.reference.put.useMutation({
    onSuccess: ({ data }) => {
      const referenceListQueryKey = getQueryKey(
        trpc.reference.list,
        { entities },
        "query"
      );
      const referenceRecordQueryKey = getQueryKey(
        trpc.reference.record,
        { id: data.id },
        "query"
      );

      queryClient.setQueryData(referenceRecordQueryKey, data); // manually updating the cache
      queryClient.invalidateQueries({ queryKey: referenceListQueryKey }); // invalidate query
    },
  });
  return mutation;
};

export const deleteReference = ({ entities }: IGetReferencesByEntityId) => {
  const mutation = trpc.reference.delete.useMutation({
    onSuccess: () => {
      const referenceListQueryKey = getQueryKey(
        trpc.reference.list,
        { entities },
        "query"
      );

      queryClient.invalidateQueries({ queryKey: referenceListQueryKey }); // invalidate query
    },
  });
  return mutation;
};
