import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Booth } from 'src/booth/entities/booth.entity';

@Entity({ name: 'registerbooth' })
export class Registerbooth {
    @PrimaryColumn()
    userId: number;

    @PrimaryColumn()
    boothId: number;

    @Column()
    reason: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Booth)
    @JoinColumn({ name: 'boothId' })
    booth: Booth;
}
