/* eslint-disable prettier/prettier */
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsString()
  imageUrl: string;

  @IsNotEmpty()
  @IsString()
  startDateTime: string;

  @IsNotEmpty()
  @IsString()
  endDateTime: string;

  @IsNotEmpty()
  @IsString()
  price: string;

  @IsBoolean()
  isFree: boolean

  @IsNotEmpty()
  @IsNumber()
  lng: number

  @IsNotEmpty()
  @IsNumber()
  lat: number

  // @IsNotEmpty()
  // @IsString()
  // categoryId: string
}
