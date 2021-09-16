import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { Contact } from './Contact';
import { Property } from './Property';
import { BaseTable } from './BaseTable';
import { AgreementStatus } from '../enums/AgreementStatus';
import { AgreementType } from '../enums/AgreementType';
import { AcquisitionType } from '../enums/AcquisitionType';

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

    @Column({ type: 'enum', enum: AgreementType })
    requestedAgreementType: AgreementType;

    @Column({ type: 'enum', enum: AgreementType })
    agreementType: AgreementType;

    @Column({ type: 'enum', enum: AcquisitionType })
    acquisitionType: AcquisitionType;

    @Column({ type: 'enum', enum: AgreementStatus })
    status: AgreementStatus;
}