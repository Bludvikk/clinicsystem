import type { GetServerSideProps, GetServerSidePropsContext } from 'next/types';
import { getServerSession } from 'next-auth';

import { nextAuthOptions } from './auth';

export const requireAuth = (func: GetServerSideProps) => async (ctx: GetServerSidePropsContext) => {
  const session = await getServerSession(ctx.req, ctx.res, nextAuthOptions);

  if (!session) {
    return {
      redirect: {
        destination: '/login', // redirect to login page
        permanent: false
      }
    };
  }

  return await func(ctx);
};
