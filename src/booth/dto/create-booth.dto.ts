import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBoothDto {

    @IsNotEmpty()
    vendorId: number;

    @IsNotEmpty()
    eventId: number;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    latitude: number;

    @IsNotEmpty()
    longitude: number;
   
}
