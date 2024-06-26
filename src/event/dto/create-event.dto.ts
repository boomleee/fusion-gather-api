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
  @IsNumber()
  category: number;

  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsString({ each: true })
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

  @IsNotEmpty()
  @IsNumber()
  qrcodeId: number; // Thêm trường này
}
