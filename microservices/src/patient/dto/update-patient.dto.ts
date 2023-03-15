import { IsOptional, IsString } from "class-validator";

export class UpdatePatientDto{
    
    @IsString()
    @IsOptional()
    Firstname?: string;

    @IsString()
    @IsOptional()
    Lastname?: string;

    @IsString()
    @IsOptional()
    password?: string;
  }