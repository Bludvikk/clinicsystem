import { trpc } from "@/utils/trpc";
import { IGetOccupation } from "@/server/schema/occupation";

export const getOccupations = () => {
  const result = trpc.occupation.list.useQuery();
  return result;
};

export const getOccupation = ({ id }: IGetOccupation) => {
  const result = trpc.occupation.record.useQuery({ id });
  return result;
};
