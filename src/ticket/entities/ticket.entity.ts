import { User } from 'src/user/entities/user.entity';
import { Event } from 'src/event/entities/event.entity';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';


@Entity({ name: 'ticket'})
export class Ticket {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Event)
    @JoinColumn({ name: 'eventId' })
    eventId: Event;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    userId: User;

    @Column()
    isScanned: boolean;
}
