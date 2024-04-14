/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateTicketDto { 
    @IsNotEmpty()
    @IsNumber()
    eventId: number;

    @IsNotEmpty()
    @IsNumber()
    userId: number;

    isScanned: boolean;
}
