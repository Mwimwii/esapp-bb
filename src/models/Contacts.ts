import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Contact {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', { length: 50 })
    firstName: string;

    @Column('varchar', { length: 50 })
    lastName: string;

    @Column('varchar', { length: 2 })
    gender: string;

    @Column('date')
    dob: string;

    @Column('varchar', { length: 50 })
    languages: string;

    @Column('varchar', { length: 50 })
    status: string;

    @Column('date')
    createdAt: string;

    @Column()
    createdBy: number;

    @Column('date')
    modifiedAt: string;

    @Column()
    modifiedBy: number;
}
