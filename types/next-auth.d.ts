import { UsersType } from '@/utils/db.type';
import NextAuth from 'next-auth';

export type AuthenticatedUserType = Pick<UsersType, 'id' | 'email' | 'userName' | 'role' | 'department' | 'status'>;

declare module 'next-auth' {
  interface Session {
    user: AuthenticatedUserType;
  }

  interface User extends AuthenticatedUserType {
    id: number;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: AuthenticatedUserType;
  }
}
