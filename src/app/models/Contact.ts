import { Entity, Column, OneToMany } from 'typeorm';
import { ContactDetail } from './ContactDetail';
import { BaseTable } from './BaseTable';
import { Identification } from '.';
import { ContactStatus } from '../enums/ContactStatus';
import { ContactType } from '../enums/ContactType';

@Entity()
export class Contact extends BaseTable {
    @Column('varchar', { length: 50 })
    firstName: string;

    @Column('varchar', { length: 50 })
    lastName: string;

    @Column('varchar', { length: 2, default: 'O' })
    gender: string;

    @Column('date')
    dob: Date;

    @Column('int')
    age: number;

    @Column({ type: 'enum', enum: ContactType })
    type: ContactType;

    @Column()
    typeValue: string;

    @Column('simple-array', { default: ['en'] })
    languages: string[];

    @OneToMany(() => ContactDetail, contactDetail => contactDetail.contact)
    contactDetails: ContactDetail[];

    @OneToMany(() => Identification, identification => identification.contact)
    identifications: Identification[];

    @Column({ type: 'enum', enum: ContactStatus })
    status: ContactStatus;
}
