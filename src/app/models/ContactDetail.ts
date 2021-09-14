import { Column, Entity, ManyToOne } from 'typeorm';
import { Contact } from './Contact';
import { BaseTable } from './BaseTable';

@Entity()
export class ContactDetail extends BaseTable {
    @Column()
    contactType: string;

    @Column()
    value: string;

    @Column('simple-array', { nullable: true })
    altContactID: number[];

    @Column({ default: false })
    preferred: boolean;

    @ManyToOne(() => Contact, contact => contact.contactDetails)
    contact: Contact;
}