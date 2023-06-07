import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { getPatient } from '@/server/hooks/patient';
import PatientViewPage from '@/views/apps/patient/view/PatientViewPage';
import { requireAuth } from '@/common/requireAuth';

export const getServerSideProps = requireAuth(async () => {
  return { props: {} };
});

const PatientView: NextPage = () => {
  const router = useRouter();
  const { patientId } = router.query;

  const patientData = getPatient({ id: parseInt(patientId as string) });

  return patientData ? <PatientViewPage data={patientData} /> : null;
};

PatientView.acl = {
  action: 'read',
  subject: 'patient'
};

export default PatientView;
