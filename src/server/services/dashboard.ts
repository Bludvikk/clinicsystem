import { Context } from '@/server/context';
import _ from 'lodash';
import moment from 'moment';

export const getReferenceStatistics = async (ctx: Context) => {
  try {
    const total = await ctx.prisma.reference.count();

    return {
      total
    };
  } catch (err) {
    throw err;
  }
};

export const getUserStatistics = async (ctx: Context) => {
  try {
    const total = await ctx.prisma.user.count();
    const totalPhysician = await ctx.prisma.user.count({ where: { roleId: 15 } });
    const totalReceptionist = await ctx.prisma.user.count({ where: { roleId: 16 } });

    return {
      total,
      totalPhysician,
      totalReceptionist
    };
  } catch (err) {
    throw err;
  }
};

export const patientStatistics = async (ctx: Context) => {
  try {
    const NOW = moment();
    const THIS_MONTH = NOW.clone().startOf('month');
    const PREVIOUS_MONTH = THIS_MONTH.clone().subtract(1, 'month');
    const NEXT_MONTH = THIS_MONTH.clone().add(1, 'month');

    const total = await ctx.prisma.patient.count();
    const thisMonthTotal = await ctx.prisma.patient.count({
      where: { createdAt: { gte: THIS_MONTH.toDate(), lt: NEXT_MONTH.toDate() } }
    });
    const previousMonthTotal = await ctx.prisma.patient.count({
      where: { createdAt: { gte: PREVIOUS_MONTH.toDate(), lt: THIS_MONTH.toDate() } }
    });

    return {
      total,
      thisMonthTotal,
      previousMonthTotal
    };
  } catch (error) {
    throw error;
  }
};

export const getClinicStatistics = async (ctx: Context) => {
  try {
    const total = await ctx.prisma.clinic.count();

    return {
      total
    };
  } catch (err) {
    throw err;
  }
};

export const getCheckupStatistics = async (ctx: Context) => {
  try {
    const total = await ctx.prisma.checkup.count();
    const totalCheckupPerClinic = await ctx.prisma.checkup.groupBy({
      by: ['clinicId'],
      _count: {
        clinicId: true
      }
    });

    return {
      total,
      totalCheckupPerClinic
    };
  } catch (err) {
    throw err;
  }
};
