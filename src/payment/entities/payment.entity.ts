/* eslint-disable prettier/prettier */
import { Event } from 'src/event/entities/event.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('payment')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;
  
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  author: User;

  @ManyToOne(() => Event)
  @JoinColumn({ name: 'eventId' })
  eventId: Event;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('int')
  quantity: number;

  @Column()
  description: string;

  @Column('boolean', { default: false })
  paid: boolean; // Trạng thái thanh toán, mặc định là false

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date; // Thời điểm tạo thanh toán, mặc định là thời điểm hiện tại
}
