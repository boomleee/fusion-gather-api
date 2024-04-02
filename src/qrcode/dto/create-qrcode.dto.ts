/* eslint-disable prettier/prettier */
import { IsNotEmpty,} from "class-validator";

export class CreateQrcodeDto {
  @IsNotEmpty()
  code: Buffer;
  }