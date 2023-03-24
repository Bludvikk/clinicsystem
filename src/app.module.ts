import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PatientModule } from './patient/patient.module';
import { User } from './user.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AuthModule, PrismaModule, PatientModule, UsersModule ],
   // exports:[AppService]
})
export class AppModule {}
