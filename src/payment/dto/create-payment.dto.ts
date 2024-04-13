/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Column, Entity } from 'typeorm';

@Entity()
export class CreatePaymentDto {
  @Column()
  @IsNumber()
  userId: number;

  @Column()
  @IsNumber()
  eventId: number;

  @Column()
  @IsString()
  name: string;

  @Column()
  @IsString()
  price: string;

  @Column()
  @IsString()
  description: string;

  @Column()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  ticketId: number;
}

