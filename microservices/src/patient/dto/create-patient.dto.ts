import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreatePatientDto {
    @IsString()
    @IsNotEmpty()
    firstname: string;

    @IsString()
    @IsNotEmpty()
    lastname: string;
  
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    middleinitial: string;

    @IsString()
    @IsNotEmpty()
    address: string;


    @IsString()
    @IsNotEmpty()
    dateOfBirth: Date;

    @IsNumber()
    civilstatusId: number;

    @IsNumber()
    age: number;

    @IsNumber()
    occupationId: number;

    @IsNumber()
    genderId: number;

    @IsString()
    @MaxLength(11)
    contactNumber: string;

    @IsObject()
    familyHistory: any;

    @IsObject()
    personalHistory: any;
    
    @IsObject()
    pastMedicalHistory: any;
    
   
    @IsObject()
    obGyne: any;



  /* @IsString()
    @IsOptional()
    @MaxLength(300)
    @ApiProperty({ required: false })
    description?: string;
  
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    body: string;
  
    @IsBoolean()
    @IsOptional()
    @ApiProperty({ required: false, default: false })
    published?: boolean = false;
    */
  }