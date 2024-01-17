import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBoothDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    eventId: number;

    @IsNotEmpty()
    vendorId: number;

    @IsNotEmpty()
    qrcodeId: number;
}
