import { IsNotEmpty, IsString } from 'class-validator';

export class CreateboothvisitorDto {
    @IsNotEmpty()
    userId: number;

    @IsNotEmpty()
    boothId: number;
}
