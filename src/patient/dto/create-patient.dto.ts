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
    First_Name: string;

    @IsString()
    @IsNotEmpty()
    Last_Name: string;
  
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    middleinitial: string;

    @IsString()
    @IsNotEmpty()
    Address: string;


    @IsString()
    @IsNotEmpty()
    DateOfBirth: Date;

    @IsNumber()
    civilstatusId: number;

    @IsNumber()
    Age: number;

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


    // { message: 'Passowrd has to be at between 3 and 20 chars' }
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