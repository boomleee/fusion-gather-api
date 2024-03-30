/* eslint-disable prettier/prettier */
import {  IsArray, IsNotEmpty, IsNumber } from 'class-validator';
export class CreateImageUrlsDto {
  @IsNotEmpty()
  @IsArray({each:true})
  imageUrls: string[];

  @IsNumber()
  eventId: number;

  @IsNumber()
  boothId: number;
}