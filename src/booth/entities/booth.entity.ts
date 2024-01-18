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
    import { Image } from 'src/image/entities/image.entity';
    import { Qrcode } from 'src/qrcode/entities/qrcode.entity';
    import { BoothLocation } from 'src/booth-location/entities/booth-location.entity';

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

    @Column()
    name: string;

    @Column()
    description: string;
}
