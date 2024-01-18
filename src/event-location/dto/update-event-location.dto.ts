import { PartialType } from '@nestjs/mapped-types';
import { CreateEventLocationDto } from './create-event-location.dto';

export class UpdateEventLocationDto extends PartialType(CreateEventLocationDto) {}
