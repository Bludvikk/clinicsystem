import { trpc } from "@/utils/trpc";
import { IGetGender } from "@/server/schema/gender";

export const getGenders = () => {
  const result = trpc.gender.list.useQuery();
  return result;
};

export const getGender = ({ id }: IGetGender) => {
  const result = trpc.gender.record.useQuery({ id });
  return result;
};
