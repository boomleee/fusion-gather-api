/* eslint-disable prettier/prettier */
import { Category } from 'src/category/entities/category.entity';
import { Qrcode } from 'src/qrcode/entities/qrcode.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'event' })
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  title: string;

  @Column('text')
  description: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  author: User;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @OneToOne(() => Qrcode)
  @JoinColumn({ name: 'qrcodeId' })
  qrcode: Qrcode;

  @Column()
  location: string;
  
  @Column()
  startDateTime: string;

  @Column()
  endDateTime: string;

  @Column()
  price: string;

  @Column('decimal', { precision: 17, scale: 14 })
  lat: number;

  @Column('decimal', { precision: 17, scale: 14 })
  lng: number;

  @Column()
  isFree: boolean;

  @Column({ default: false })
  isPublished: boolean;
}