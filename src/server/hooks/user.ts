import { trpc } from "@/utils/trpc";

export const getUsers = () => {
  const result = trpc.user.list.useQuery(undefined, { staleTime: Infinity });
  return result;
};

export const postUser = () => {
  const mutation = trpc.user.register.useMutation();
  return mutation;
};
