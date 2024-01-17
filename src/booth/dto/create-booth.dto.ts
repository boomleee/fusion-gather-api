import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBoothDto {

    @IsNotEmpty()
    vendorId: number;

    @IsNotEmpty()
    eventId: number;

    @IsNotEmpty()
    qrcodeId: number;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;
   
}
