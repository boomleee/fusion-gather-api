import { PartialType } from '@nestjs/mapped-types';
import { CreateFolloweventDto } from './create-followevent.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateFolloweventDto extends PartialType(CreateFolloweventDto) {
    @IsNotEmpty()
    @IsNumber()
    userId: number;

    @IsNotEmpty()
    @IsNumber()
    eventId: number;
}
