import {Injectable} from '@nestjs/common';
import { Patient } from '@prisma/client';
import {Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { PatientModule } from './patient.module';
import { PrismaClient} from '@prisma/client';
import { PartialType } from '@nestjs/mapped-types';
import { User } from '@prisma/client';
import { ViewPatientDto } from './dto/view-patient.dto';

const prisma = new PrismaClient();
  
  @Injectable()
  export class PatientService {
    constructor(private prisma: PrismaService) {}

    async createPatient(createPatientDto: CreatePatientDto) {
      const patient = await this.prisma.patient.create({
        // @ts-ignore
        data: createPatientDto,
      });
      return patient;
    }
    
    async getPatients() {
      const patients = await this.prisma.patient.findMany();
      return patients;
    }
  }