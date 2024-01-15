import {
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'event' })
export class Event {
    @PrimaryGeneratedColumn()
    id: number;

}
