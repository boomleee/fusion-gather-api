import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
@Entity({ name: 'eventLocation' })  
export class EventLocation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    address: string;

    @Column('decimal', { precision: 17, scale: 14})
    latitude: number;

    @Column('decimal', { precision: 17, scale: 14})
    longitude: number;
}
