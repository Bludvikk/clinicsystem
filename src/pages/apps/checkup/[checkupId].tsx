import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { getCheckup } from '@/server/hooks/checkup';
import CheckupViewPage from '@/views/apps/checkup/view/CheckupViewPage';
import { requireAuth } from '@/common/requireAuth';

export const getServerSideProps = requireAuth(async () => {
  return { props: {} };
});

const PatientCheckupView: NextPage = () => {
  const router = useRouter();
  const { checkupId } = router.query;

  const checkupData = getCheckup({ id: parseInt(checkupId as string) });

  return checkupData ? <CheckupViewPage data={checkupData} /> : null;
};

PatientCheckupView.acl = {
  action: 'read',
  subject: 'checkup'
};

export default PatientCheckupView;
