import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Contact } from './Contact';
import { BaseTable } from './BaseTable';
import { IdentificationStatus } from 'app/enums/IdentificationStatus';
import { IdentificationType } from 'app/enums/IdentificationType';

@Entity()
export class Identification extends BaseTable {

    @JoinColumn()
    @OneToOne(() => Contact)
    contact: Contact;

    @Column()
    identificationType: IdentificationType;

    @Column()
    identificationNumber: string;

    @Column('date')
    expirationDate: Date;

    @Column()
    status: IdentificationStatus;
}