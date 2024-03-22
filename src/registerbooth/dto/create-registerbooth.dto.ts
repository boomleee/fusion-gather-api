import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRegisterboothDto {
    @IsNotEmpty()
    userId: number;

    @IsNotEmpty()
    boothId: number;

    @IsString()
    reason: string;
}
