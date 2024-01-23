/* eslint-disable prettier/prettier */
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'event' })
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  title: string;

  @Column('text')
  description: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  author: User;

  @Column()
  location: string;

  @Column()
  imageUrl: string;

  @Column()
  startDateTime: string;

  @Column()
  endDateTime: string;

  @Column()
  price: string;

  @Column()
  lng: number;

  @Column()
  lat: number;

  @Column()
  isFree: boolean;

  // @Column()
  // @JoinColumn({ name: 'categoryId' })
  // categoryId: Category;
}
