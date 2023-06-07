import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { getClinic } from '@/server/hooks/clinic';
import ClinicViewPage from '@/views/apps/clinic/view/ClinicViewPage';
import { requireAuth } from '@/common/requireAuth';

export const getServerSideProps = requireAuth(async () => {
  return { props: {} };
});

const ClinicView: NextPage = () => {
  const router = useRouter();
  const { clinicId } = router.query;

  const clinicData = getClinic({ id: parseInt(clinicId as string) });

  return clinicData ? <ClinicViewPage data={clinicData} /> : null;
};

ClinicView.acl = {
  action: 'read',
  subject: 'clinic'
};

export default ClinicView;
