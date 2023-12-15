import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDummyDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  dob?: string;
}
