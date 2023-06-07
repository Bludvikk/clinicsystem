import { ClinicsType, UsersType } from '@/utils/db.type';
import ClinicViewPhysiciansTableList from './ClinicViewPhysiciansTableList';

interface ClinicViewPhysiciansPropsType {
  clinicData: ClinicsType;
  usersData: UsersType[];
}

const ClinicViewPhysicians = ({ clinicData, usersData }: ClinicViewPhysiciansPropsType) => {
  return usersData ? <ClinicViewPhysiciansTableList clinicData={clinicData} usersData={usersData} /> : null;
};

export default ClinicViewPhysicians;
