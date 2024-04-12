/* eslint-disable prettier/prettier */
import { IsNumber, IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CreatePaymentDto {
  @PrimaryGeneratedColumn()
  id: number;

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
}

