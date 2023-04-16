import { trpc, queryClient } from "@/utils/trpc";
import { IGetReference, IGetReferencesByEntityId } from "../schema/reference";
import { getQueryKey } from "@trpc/react-query";
import { FilterQueryInputType } from "@/utils/common.type";
import { getEntities } from "./entity";
import { FilterData } from "@/utils/rq.context";

export const getDependencyData = (filterQuery: FilterQueryInputType) => {
  const entities = getEntities();
  const references = getReferences(filterQuery);

  return { entities, references };
};

export const getReferences = ({
  entities,
  ...filterQuery
}: FilterQueryInputType) => {
  const result = trpc.reference.list.useQuery(entities ? { entities } : {}, {
    select: (data) => new FilterData(data, filterQuery).filter(),
    enabled: !!entities,
    staleTime: Infinity,
  });
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
      queryClient.setQueryData(
        getQueryKey(trpc.reference.record, { id: data.id }, "query"),
        data
      ); // manually updating the cache
      queryClient.invalidateQueries({
        queryKey: getQueryKey(trpc.reference.list, { entities }, "query"),
      }); // invalidate query
    },
  });
  return mutation;
};

export const putReference = ({ entities }: IGetReferencesByEntityId) => {
  const mutation = trpc.reference.put.useMutation({
    onSuccess: ({ data }) => {
      queryClient.setQueryData(
        getQueryKey(trpc.reference.record, { id: data.id }, "query"),
        data
      ); // manually updating the cache
      queryClient.invalidateQueries({
        queryKey: getQueryKey(trpc.reference.list, { entities }, "query"),
      }); // invalidate query
    },
  });
  return mutation;
};

export const deleteReference = ({ entities }: IGetReferencesByEntityId) => {
  const mutation = trpc.reference.delete.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getQueryKey(trpc.reference.list, { entities }, "query"),
      }); // invalidate query
    },
  });
  return mutation;
};
