import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Qrcode } from 'src/qrcode/entities/qrcode.entity';

@Entity({ name: 'event' })
export class Event {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    name: string;

    @Column()
    date: Date;

    @OneToOne(() => User)
    @JoinColumn({ name: 'userId' })
    organizerId: User;

    @OneToOne(() => Qrcode)
    @JoinColumn({ name: 'qrcodeId' })
    qrcodeId: Qrcode;

    @Column()
    capacity: number;

    @Column()
    ticketPrice: number;

    @Column()
    isFree: boolean;

    @Column()
    status: boolean;

    @Column()
    description: string;
}
