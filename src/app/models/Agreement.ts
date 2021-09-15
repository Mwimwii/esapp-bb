import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { Contact } from './Contact';
import { Property } from './Property';
import { BaseTable } from './BaseTable';
import { AgreementStatus } from 'app/enums/AgreementStatus';
import { AgreementType } from 'app/enums/AgreementType';
import { AcquisitionType } from 'app/enums/AcquisitionType';

@Entity()
export class Agreement extends BaseTable {
    @JoinColumn()
    @ManyToOne(() => Property)
    property: Property;

    @JoinColumn()
    @ManyToOne(() => Contact)
    owner: Contact;

    @JoinColumn()
    @ManyToOne(() => Contact)
    tenant: Contact;

    @JoinTable()
    @ManyToMany(() => Contact)
    secondaryTenants: Contact[];

    @Column('date')
    dateArrived: Date;

    @Column()
    requestedAgreementType: AgreementType;

    @Column()
    agreementType: AgreementType;

    @Column()
    acquisitionType: AcquisitionType;

    @Column()
    status: AgreementStatus;
}