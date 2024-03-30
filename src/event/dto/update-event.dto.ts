/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateEventDto } from './create-event.dto';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateEventDto extends PartialType(CreateEventDto) {
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
  imageUrl: string[];

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
