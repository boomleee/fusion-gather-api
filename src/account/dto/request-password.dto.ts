import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class ResetPasswordDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  newPassword: string;
}
