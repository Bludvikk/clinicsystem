import { Controller ,Get, Param, Post, Put } from '@nestjs/common';
import { Body } from '@nestjs/common/decorators';
import { Patient } from '@prisma/client';
import { CreatePatientDto } from './dto/create-patient.dto';
import { ViewPatientDto } from './dto/view-patient.dto';
import { PatientService } from './patient.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PrismaService } from 'prisma/prisma.service';

@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService, private prisma: PrismaService ){}

  @Post()
  async createPatient(@Body() createPatientDto: CreatePatientDto) {
    const createPatient = await this.patientService.createPatient(createPatientDto);
    return createPatient;
  /*create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientService.create(createPatientDto);
  }*/
}

@Get()
@ApiResponse({ status: 200, type: [ViewPatientDto] })
async getPatients(): Promise<ViewPatientDto[]> {
  const patients = await this.patientService.getPatients();
  
  return patients.map((patient) => ({
    id: patient.id,
     // @ts-ignore
    Firstname: patient.firstname,
     // @ts-ignore
    Lastname: patient.lastname
  }));

}


@Put(':id')
async put(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
  // TODO: update user with Prisma
  const updatedPatient = await this.prisma.patient.update({
    where: {id},
    data: updatePatientDto,
  });
  return updatedPatient;

}
}

