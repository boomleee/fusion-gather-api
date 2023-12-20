import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'dummy' })
export class Dummy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  dob: string;
}
