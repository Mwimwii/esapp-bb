import { Column, Entity, ManyToOne } from 'typeorm';
import { Contact } from './Contact';
import { BaseTable } from './BaseTable';
import { ContactDetailStatus } from '../enums/ContactDetailStatus';
import { ContactDetailType } from '../enums/ContactDetailType';

@Entity()
export class ContactDetail extends BaseTable {
    @Column({ type: 'enum', enum: ContactDetailType })
    type: ContactDetailType;

    @Column()
    typeValue: string;

    @Column('simple-array', { nullable: true })
    altContactID: number[];

    @Column({ default: false })
    preferred: boolean;

    @ManyToOne(() => Contact, contact => contact.contactDetails)
    contact: Contact;

    @Column({ type: 'enum', enum: ContactDetailStatus })
    status: ContactDetailStatus;
}
