import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDto {

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  newPassword: string;

}