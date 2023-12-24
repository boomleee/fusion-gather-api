import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class ResetPasswordCodeDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  verificationCode: string;
}
