import { PartialType } from '@nestjs/mapped-types';
import { CreateRegisterboothDto } from './create-registerbooth.dto';

export class UpdateRegisterboothDto extends PartialType(CreateRegisterboothDto) {}
