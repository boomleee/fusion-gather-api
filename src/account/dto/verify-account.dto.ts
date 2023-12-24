import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyAccountDto {
  @IsNotEmpty()
  @IsString()
  verificationCode: string;

  @IsNotEmpty()
  @IsString()
  username: string;
}
