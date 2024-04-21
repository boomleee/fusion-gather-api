import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';


@Entity({ name: 'boothvisitor' })
export class Boothvisitor {
    @PrimaryColumn()
    userId: number;

    @PrimaryColumn()
    boothId: number;

}
