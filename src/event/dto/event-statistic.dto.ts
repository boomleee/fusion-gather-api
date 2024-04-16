/* eslint-disable prettier/prettier */
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class EventStatisticDTO {
  @IsNotEmpty()
  @IsNumber()
  totalEvents: number;

  @IsNotEmpty()
  @IsNumber()
  totalPublishedEvents: number;

  @IsNotEmpty()
  @IsNumber()
  totalPendingEvents: number;

  @IsNotEmpty()
  @IsNumber()
  totalTickets: number;
}
