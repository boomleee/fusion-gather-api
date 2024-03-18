import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Event } from 'src/event/entities/event.entity';

@Entity({ name: 'followevent' })
export class Followevent {
    @PrimaryColumn()
    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    userId: User;

    @PrimaryColumn()
    @ManyToOne(() => Event)
    @JoinColumn({ name: 'eventId' })
    eventId: Event;
}
