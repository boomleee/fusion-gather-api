import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDummyDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  phone: number;

  @IsOptional()
  @IsString()
  dob?: string;
}
