import { PartialType } from '@nestjs/mapped-types';
import { CreateBoothLocationDto } from './create-booth-location.dto';

export class UpdateBoothLocationDto extends PartialType(CreateBoothLocationDto) {}
