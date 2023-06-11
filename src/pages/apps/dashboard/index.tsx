import { NextPage } from 'next';

import { requireAuth } from '@/common/requireAuth';
import { Card, CardContent, CardHeader, Grid, Typography } from '@mui/material';
import Icon from '@/@core/components/icon';
import CardStatsHorizontal from '@/@core/components/card-statistics/card-stats-horizontal';
import CardStatsVertical from '@/@core/components/card-statistics/card-stats-vertical';
import {
  getCheckupStatistics,
  getClinicStatistics,
  getPatientStatistics,
  getReferenceStatistics,
  getUserStatistics
} from '@/server/hooks/dashboard';

export const getServerSideProps = requireAuth(async () => {
  return { props: {} };
});

const Dashboard: NextPage = () => {
  const { data: referenceStat } = getReferenceStatistics();
  const { data: patientStat } = getPatientStatistics();
  const { data: userStat } = getUserStatistics();
  const { data: clinicStat } = getClinicStatistics();
  const { data: checkupStat } = getCheckupStatistics();

  const getTrend = (previous: number, current: number) => {
    if (previous && current) {
      return current > previous ? 'positive' : 'negative';
    } else return undefined;
  };

  const getTrendNumber = (previous: number, current: number) => {
    if (previous && current) {
      const sign = current > previous ? '+' : '';
      return `${sign}${(((current - previous) / previous) * 100).toFixed(2)}%`;
    } else return undefined;
  };

  return (
    <Grid container spacing={6}>
      <Grid item xs={6} md={4} lg={3}>
        <CardStatsHorizontal
          stats={referenceStat?.total ? referenceStat?.total.toLocaleString() : ''}
          title='Total Reference'
          color='secondary'
          icon={<Icon icon='mdi:list-box-outline' />}
        />
      </Grid>
      <Grid item xs={6} md={4} lg={3}>
        <CardStatsHorizontal
          stats={userStat?.total ? userStat?.total.toLocaleString() : ''}
          title='Total User'
          color='primary'
          icon={<Icon icon='mdi:account-outline' />}
        />
      </Grid>
      <Grid item xs={6} md={4} lg={3}>
        <CardStatsHorizontal
          stats={userStat?.totalPhysician ? userStat?.totalPhysician.toLocaleString() : ''}
          title='Total Physician'
          color='warning'
          icon={<Icon icon='mdi:doctor' />}
        />
      </Grid>
      <Grid item xs={6} md={4} lg={3}>
        <CardStatsHorizontal
          stats={userStat?.totalReceptionist ? userStat?.totalReceptionist.toLocaleString() : ''}
          title='Total Receptionist'
          color='success'
          icon={<Icon icon='uil:user-md' />}
        />
      </Grid>
      <Grid item xs={6} md={4} lg={3}>
        <CardStatsHorizontal
          stats={clinicStat?.total ? clinicStat?.total.toLocaleString() : ''}
          title='Total Clinic'
          color='info'
          icon={<Icon icon='mdi:home-city-outline' />}
        />
      </Grid>
      <Grid item xs={6} md={4} lg={3}>
        <CardStatsHorizontal
          stats={patientStat?.total ? patientStat?.total.toLocaleString() : ''}
          title='Total Patient'
          color='info'
          icon={<Icon icon='mdi:patient-outline' />}
        />
      </Grid>
      <Grid item xs={6} md={4} lg={3}>
        <CardStatsHorizontal
          stats={checkupStat?.total ? checkupStat?.total.toLocaleString() : ''}
          title='Total Checkup'
          color='info'
          icon={<Icon icon='tabler:checkup-list' />}
        />
      </Grid>
      <Grid item xs={6} md={4} lg={3}>
        <CardStatsHorizontal
          stats={
            checkupStat?.total && clinicStat?.total ? `${(checkupStat?.total / clinicStat?.total).toFixed(2)}%` : ''
          }
          title='Average Checkup'
          color='info'
          icon={<Icon icon='tabler:checkup-list' />}
        />
      </Grid>

      {/* stats for this month compared to previous month */}
      {/* <Grid item xs={6} md={4} lg={2}>
        <CardStatsVertical
          stats={patientStat?.thisMonthTotal ? patientStat?.thisMonthTotal.toLocaleString() : ''}
          title='Total Patient'
          color='primary'
          trend={patientStat && getTrend(patientStat.previousMonthTotal, patientStat.thisMonthTotal)}
          trendNumber={patientStat && getTrendNumber(patientStat.previousMonthTotal, patientStat.thisMonthTotal)}
          icon={<Icon icon='mdi:account-outline' />}
          chipText='This Month'
        />
      </Grid> */}
    </Grid>
  );
};

export default Dashboard;

Dashboard.acl = {
  action: 'read',
  subject: 'dashboard'
};
