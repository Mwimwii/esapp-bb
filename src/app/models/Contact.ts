import { Entity, Column, OneToMany } from 'typeorm';
import { ContactDetail } from './ContactDetail';
import { BaseTable } from './BaseTable';
import { Identification } from '.';
import { ContactStatus } from '../enums/ContactStatus';

@Entity()
export class Contact extends BaseTable {
    @Column('varchar', { length: 50, nullable: true })
    firstName: string;

    @Column('varchar', { length: 50, nullable: true })
    lastName: string;

    @Column('varchar', { length: 2, default: 'O' })
    gender: string;

    @Column('date', { nullable: true })
    dob: Date;

    @Column('int', { nullable: true })
    age: number;

    @Column('simple-array', { default: ['en'] })
    languages: string[];

    @OneToMany(() => ContactDetail, contactDetail => contactDetail.contact, { cascade: true })
    contactDetails: ContactDetail[];

    @OneToMany(() => Identification, identification => identification.contact, { cascade: true })
    identifications: Identification[];

    @Column({ type: 'enum', enum: ContactStatus, default: ContactStatus.active })
    status: ContactStatus;
}