import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
import { Event } from 'src/event/entities/event.entity';
import { Booth } from 'src/booth/entities/booth.entity';
@Entity({ name: 'image' })
export class Image {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    url: string;

    @ManyToOne(() => Event)
    @JoinColumn({ name: 'eventId' })
    eventId: Event;

    @ManyToOne(() => Booth)
    @JoinColumn({ name: 'boothId' })
    boothId: Booth;
}
