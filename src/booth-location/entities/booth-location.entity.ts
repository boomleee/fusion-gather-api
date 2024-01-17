import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
import { EventLocation } from 'src/event-location/entities/event-location.entity';
import { Booth } from 'src/booth/entities/booth.entity';

@Entity({ name: 'boothLocation' })
export class BoothLocation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('decimal', { precision: 17, scale: 14})
    latitude: number;

    @Column('decimal', { precision: 17, scale: 14})
    longitude: number;

    @OneToOne(() => Booth)
    @JoinColumn({ name: 'boothId' })
    boothId: Booth;

    @ManyToOne(() => EventLocation)
    @JoinColumn({ name: 'eventLocationId' })
    eventLocationId: EventLocation;
}
