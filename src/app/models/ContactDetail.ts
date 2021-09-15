import { Column, Entity, ManyToOne } from 'typeorm';
import { Contact } from './Contact';
import { BaseTable } from './BaseTable';
import { ContactType } from 'app/enums/ContactType';
import { ContactDetailStatus } from 'app/enums/ContactDetailStatus';

@Entity()
export class ContactDetail extends BaseTable {
    @Column()
    contactType: ContactType;

    @Column()
    value: string;

    @Column('simple-array', { nullable: true })
    altContactID: number[];

    @Column({ default: false })
    preferred: boolean;

    @ManyToOne(() => Contact, contact => contact.contactDetails)
    contact: Contact;

    @Column()
    status: ContactDetailStatus;
}