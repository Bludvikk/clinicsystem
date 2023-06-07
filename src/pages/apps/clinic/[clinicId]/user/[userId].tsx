import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { getUser } from '@/server/hooks/user';
import UserViewPage from '@/views/apps/user/view/UserViewPage';
import { requireAuth } from '@/common/requireAuth';

export const getServerSideProps = requireAuth(async () => {
  return { props: {} };
});

const ClinicPhysicianView: NextPage = () => {
  const router = useRouter();
  const { userId } = router.query;

  const userData = getUser({ id: parseInt(userId as string) });

  return userData ? <UserViewPage data={userData} /> : null;
};

ClinicPhysicianView.acl = {
  action: 'read',
  subject: 'user'
};

export default ClinicPhysicianView;
