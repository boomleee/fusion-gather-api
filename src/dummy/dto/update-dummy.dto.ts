import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateDummyDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  dob?: string;
}
