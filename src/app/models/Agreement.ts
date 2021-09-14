import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne } from 'typeorm';
import { Contact } from './Contact';
import { Property } from './Property';
import { BaseTable } from './BaseTable';

@Entity()
export class Agreement extends BaseTable {
    @JoinColumn()
    @OneToOne(() => Property)
    property: Property;

    @JoinColumn()
    @OneToOne(() => Contact)
    owner: Contact;

    @JoinColumn()
    @OneToOne(() => Contact)
    tenant: Contact;

    @JoinTable()
    @ManyToMany(() => Contact)
    secondaryTenants: Contact[];

    @Column('date')
    dateArrived: Date;

    @Column()
    requestedAgreementType: string;

    @Column()
    agreementType: string;

    @Column()
    acquisitionType: string;
}