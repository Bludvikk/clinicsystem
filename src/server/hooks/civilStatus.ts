import { trpc } from "@/utils/trpc";
import { IGetCivilStatus } from "@/server/schema/civilStatus";

export const getCivilStatuses = () => {
  const result = trpc.civilStatus.list.useQuery();
  return result;
};

export const getCivilStatus = ({ id }: IGetCivilStatus) => {
  const result = trpc.civilStatus.record.useQuery({ id });
  return result;
};
