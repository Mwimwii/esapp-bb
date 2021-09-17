import { Column, Entity, ManyToOne } from 'typeorm';
import { Contact } from './Contact';
import { BaseTable } from './BaseTable';
import { ContactType } from '../enums/ContactType';
import { ContactDetailStatus } from '../enums/ContactDetailStatus';

@Entity()
export class ContactDetail extends BaseTable {
    @Column({ type: 'enum', enum: ContactType })
    contactType: ContactType;

    @Column()
    value: string;

    @Column('simple-array', { nullable: true })
    altContactID: number[];

    @Column({ default: false })
    preferred: boolean;

    @ManyToOne(() => Contact, contact => contact.contactDetails)
    contact: Contact;

    @Column({ type: 'enum', enum: ContactDetailStatus })
    status: ContactDetailStatus;
}