import { PartialType } from '@nestjs/mapped-types';
import { CreateEventDto } from './create-event.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateEventDto extends PartialType(CreateEventDto) {
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    name: string;

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    description: string;
}
