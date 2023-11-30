import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateDummyDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  phone?: number;

  @IsOptional()
  @IsString()
  dob?: string;
}
