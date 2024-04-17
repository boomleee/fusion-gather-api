/* eslint-disable prettier/prettier */
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class EventStatisticDTO {

  @IsNotEmpty()
  @IsNumber()
  totalBooths: number;

  @IsNotEmpty()
  @IsNumber()
  totalTickets: number;

  @IsNotEmpty()
  @IsNumber()
  totalVisitors: number;

  @IsNotEmpty()
  @IsNumber()
  eventRevenue: number;
}
