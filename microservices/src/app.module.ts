import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PatientModule } from './patient/patient.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AuthModule, PrismaModule, PatientModule, UsersModule],
})
export class AppModule {}
