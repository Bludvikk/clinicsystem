import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { verify } from 'argon2';

import { prisma } from './prisma';
import { loginUserDtoSchema } from '../server/schema/user';
import { AuthenticatedUserType } from 'types/next-auth';

export const nextAuthOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials-auth',
      type: 'credentials',
      credentials: {},
      authorize: async credentials => {
        try {
          const { email, password } = await loginUserDtoSchema.parseAsync(credentials);

          const user = await prisma.user.findUnique({
            where: { email },
            include: {
              role: {
                select: {
                  id: true,
                  code: true,
                  name: true
                }
              },
              department: {
                select: {
                  id: true,
                  code: true,
                  name: true
                }
              },
              status: {
                select: {
                  id: true,
                  code: true,
                  name: true
                }
              }
            }
          });
          if (!user) throw new Error('Invalid credentials.');

          const isValidPassword = await verify(user.password, password);
          if (!isValidPassword) throw new Error('Invalid credentials.');

          return {
            id: user.id,
            email: user.email,
            userName: user.userName,
            role: user.role,
            department: user.department,
            status: user.status
          };
        } catch (err) {
          throw err;
        }
      }
    })
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) token.user = user as AuthenticatedUserType;
      return token;
    },
    session: async ({ session, token }) => {
      if (token) session.user = token.user;
      return session;
    }
  },
  jwt: {
    maxAge: 24 * 60 * 60 // 24 hours
  },
  pages: {
    signIn: '/login',
    signOut: '/login'
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.JWT_SECRET
};
