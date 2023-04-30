import { FilterQueryInputType } from '@/utils/common.type';
import { FilterData, InvalidateQueries, SetQueryDataDeleted } from '@/utils/rq.context';
import { trpc } from '@/utils/trpc';

export const getUsers = (filterQuery?: FilterQueryInputType) => {
  const result = trpc.user.list.useQuery(
    {},
    {
      staleTime: Infinity,
      select: data => new FilterData(data, filterQuery).filter()
    }
  );
  return result;
};

export const getUser = ({ id }: FilterQueryInputType) => {
  const { data } = getUsers({ id });
  return data?.find(row => row.id === id);
};

export const postUser = () => {
  const mutation = trpc.user.post.useMutation({
    onSuccess: () => {
      InvalidateQueries({ queryKey: {}, routerKey: 'user' });
    }
  });
  return mutation;
};

export const deleteUser = () => {
  const mutation = trpc.user.delete.useMutation({
    onSuccess: ({ id }) => {
      SetQueryDataDeleted({
        queryKey: {},
        routerKey: 'user',
        filterQuery: { id }
      });
    }
  });

  return mutation;
};
