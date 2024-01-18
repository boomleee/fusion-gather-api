import { PartialType } from '@nestjs/mapped-types';
import { CreateQrcodeDto } from './create-qrcode.dto';

export class UpdateQrcodeDto extends PartialType(CreateQrcodeDto) {}
