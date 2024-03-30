import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateFolloweventDto {
    @IsNotEmpty()
    userId: number;

    @IsNotEmpty()
    eventId: number;
}
