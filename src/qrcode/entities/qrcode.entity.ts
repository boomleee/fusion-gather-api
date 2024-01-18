import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
@Entity({ name: 'qrcode' })
export class Qrcode {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    code: string;
}
