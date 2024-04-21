import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
    import { User } from 'src/user/entities/user.entity';
    import { Event } from 'src/event/entities/event.entity';
    import { Qrcode } from 'src/qrcode/entities/qrcode.entity';
  

@Entity({ name: 'booth' })   
export class Booth {
    @PrimaryGeneratedColumn()
    id: number;
    
    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    vendorId: User;

    @ManyToOne(() => Event)
    @JoinColumn({ name: 'eventId' })
    eventId: Event;

    @OneToOne(() => Qrcode)
    @JoinColumn({ name: 'qrcodeId' })
    qrcodeId: Qrcode;

    @Column('decimal', { precision: 17, scale: 14})
    latitude: number;

    @Column('decimal', { precision: 17, scale: 14})
    longitude: number;

    @Column()
    name: string;

    @Column('text')
    description: string;
}
