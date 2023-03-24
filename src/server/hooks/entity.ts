import { trpc, queryClient } from "@/utils/trpc";
import { IGetEntity } from "../schema/entity";
import { getQueryKey } from "@trpc/react-query";

const entityListQueryKey = getQueryKey(trpc.entity.list, undefined, "query");

export const getEntities = () => {
  const result = trpc.entity.list.useQuery(undefined, { staleTime: Infinity });
  return result;
};

export const getEntity = ({ id }: IGetEntity) => {
  const result = trpc.entity.record.useQuery(
    { id },
    {
      enabled: !!id,
      staleTime: Infinity,
    }
  );
  return result;
};

export const postEntity = () => {
  const mutation = trpc.entity.post.useMutation({
    onSuccess: ({ data }) => {
      const entityRecordQueryKey = getQueryKey(
        trpc.entity.record,
        { id: data.id },
        "query"
      );

      queryClient.setQueryData(entityRecordQueryKey, data); // manually updating the cache
      queryClient.invalidateQueries({ queryKey: entityListQueryKey }); // invalidate query
    },
  });
  return mutation;
};

export const putEntity = () => {
  const mutation = trpc.entity.put.useMutation({
    onSuccess: ({ data }) => {
      const entityRecordQueryKey = getQueryKey(
        trpc.entity.record,
        { id: data.id },
        "query"
      );

      queryClient.setQueryData(entityRecordQueryKey, data); // manually updating the cache
      queryClient.invalidateQueries({ queryKey: entityListQueryKey }); // invalidate query
    },
  });
  return mutation;
};

export const deleteEntity = () => {
  const mutation = trpc.entity.delete.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: entityListQueryKey }); // invalidate query
    },
  });
  return mutation;
};
