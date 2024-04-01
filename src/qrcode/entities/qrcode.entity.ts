/* eslint-disable prettier/prettier */
import { Event } from 'src/event/entities/event.entity';
import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
@Entity({ name: 'qrcode' })
export class Qrcode {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column('text')
    qrCode: string; 

    @OneToOne(() => Event)
    @JoinColumn({ name: 'eventId' })
    eventId: Event;
}
