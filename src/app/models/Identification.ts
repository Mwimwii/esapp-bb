import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Contact } from '.';
import { BaseTable } from './BaseTable';
import { IdentificationStatus, IdentificationType } from '@titl-all/shared/dist/enum';
import { IdentificationAPI } from '@titl-all/shared/dist/api-model';

@Entity({ name: 'identifications' })
export class Identification extends BaseTable implements IdentificationAPI {

    @JoinColumn()
    @ManyToOne(() => Contact)
    contact: Contact;

    @Column({ type: 'enum', enum: IdentificationType })
    identificationType: IdentificationType;

    @Column()
    identificationNumber: string;

    @Column('date')
    expirationDate: Date;

    @Column({ type: 'enum', enum: IdentificationStatus, default: IdentificationStatus.underreview })
    status: IdentificationStatus;

    @Column({ default: false })
    hasIdentificationImages: boolean;
}
