import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Contact } from './Contact';
import { BaseTable } from './BaseTable';

@Entity()
export class Identification extends BaseTable {

    @JoinColumn()
    @OneToOne(() => Contact)
    contact: Contact;

    @Column()
    identificationType: string;

    @Column()
    identificationNumber: string;

    @Column('date')
    expirationDate: Date;
}