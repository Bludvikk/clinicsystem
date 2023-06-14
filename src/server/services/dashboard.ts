import { Context } from '@/server/context';
import { FilterQueryInputType } from '@/utils/common.type';
import _ from 'lodash';
import moment from 'moment';

export const getDashboardStatistics = async (ctx: Context, filterQuery?: FilterQueryInputType) => {
  const NOW = moment();
  const THIS_MONTH = NOW.clone().startOf('month');
  const PREVIOUS_MONTH = THIS_MONTH.clone().subtract(1, 'month');
  const NEXT_MONTH = THIS_MONTH.clone().add(1, 'month');

  try {
    // ** Reference
    const totalReferences = await ctx.prisma.reference.count();

    // ** User
    const totalUser = await ctx.prisma.user.count();
    const totalPhysician = await ctx.prisma.user.count({ where: { roleId: 14 } });
    const totalReceptionist = await ctx.prisma.user.count({ where: { roleId: 15 } });

    // ** Patient
    const totalPatient = await ctx.prisma.patient.count();
    const totalPatientThisMonth = await ctx.prisma.patient.count({
      where: { createdAt: { gte: THIS_MONTH.toDate(), lt: NEXT_MONTH.toDate() } }
    });
    const totalPatientPreviousMonth = await ctx.prisma.patient.count({
      where: { createdAt: { gte: PREVIOUS_MONTH.toDate(), lt: THIS_MONTH.toDate() } }
    });

    // ** Clinic
    const totalClinic = await ctx.prisma.clinic.count();

    // ** Checkup
    const totalCheckup = await ctx.prisma.checkup.count();
    const totalCheckupPerClinic = await ctx.prisma.checkup.groupBy({
      by: ['clinicId'],
      _count: {
        clinicId: true
      }
    });

    return {
      reference: { total: totalReferences },
      user: { total: totalUser, totalPhysician, totalReceptionist },
      patient: {
        total: totalPatient,
        thisMonthTotal: totalPatientThisMonth,
        previousMonthTotal: totalPatientPreviousMonth
      },
      clinic: { total: totalClinic },
      checkup: { total: totalCheckup, totalCheckupPerClinic }
    };
  } catch (err) {
    throw err;
  }
};
