/* eslint-disable prettier/prettier */
import { Event } from 'src/event/entities/event.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';

@Entity('payment')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;
  
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  userId: User;

  @ManyToOne(() => Event)
  @JoinColumn({ name: 'eventId' })
  eventId: Event;

  @OneToOne(() => Ticket)
  @JoinColumn({ name: 'ticketId' })
  ticketId: Ticket;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('int')
  quantity: number;

  @Column('boolean', { default: false })
  paid: boolean;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
