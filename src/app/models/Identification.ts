import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Contact } from './Contact';
import { BaseTable } from './BaseTable';
import { IdentificationStatus } from '../enums/IdentificationStatus';
import { IdentificationType } from '../enums/IdentificationType';

@Entity()
export class Identification extends BaseTable {

    @JoinColumn()
    @ManyToOne(() => Contact)
    contact: Contact;

    @Column({ type: 'enum', enum: IdentificationType })
    identificationType: IdentificationType;

    @Column()
    identificationNumber: string;

    @Column('date')
    expirationDate: Date;

    @Column({ type: 'enum', enum: IdentificationStatus })
    status: IdentificationStatus;
}