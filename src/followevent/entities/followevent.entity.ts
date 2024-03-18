import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Event } from 'src/event/entities/event.entity';

@Entity({ name: 'followevent' })
export class Followevent {
    @PrimaryColumn()
    userId: number;

    @PrimaryColumn()
    eventId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Event)
    @JoinColumn({ name: 'eventId' })
    event: Event;
}
