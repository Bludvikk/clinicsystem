import { Module } from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PatientController],
  providers: [PatientService]
})
export class PatientModule {}
