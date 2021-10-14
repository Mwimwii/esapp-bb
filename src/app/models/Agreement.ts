import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { Contact, PaymentPlan, Property } from '.';
import { BaseTable } from './BaseTable';
import { AgreementStatus } from '../enums/AgreementStatus';
import { AgreementType } from '../enums/AgreementType';
import { AcquisitionType } from '../enums/AcquisitionType';

@Entity({ name: 'agreements' })
export class Agreement extends BaseTable {
  fieldsNoRelations() {
    return {
      secondaryTenants: this.secondaryTenants,
      dateArrived: this.dateArrived,
      requestedAgreementType: this.requestedAgreementType,
      agreementType: this.agreementType,
      acquisitionType: this.acquisitionType,
      status: this.status,
    }
  }

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

  @OneToMany(() => PaymentPlan, paymentPlan => paymentPlan.agreement, { cascade: true })
  paymentPlans: PaymentPlan[];

  @Column('date', { nullable: true })
  dateArrived: Date;

  @Column({ type: 'enum', enum: AgreementType, nullable: true })
  requestedAgreementType: AgreementType;

  @Column({ type: 'enum', enum: AgreementType, nullable: true })
  agreementType: AgreementType;

  @Column({ type: 'enum', enum: AcquisitionType, nullable: true })
  acquisitionType: AcquisitionType;

  @Column({ type: 'enum', enum: AgreementStatus, nullable: true })
  status: AgreementStatus;

  // Airtable.TenantID connects to Contact.airTableId
  @Column()
  airTableTenantId: string;
}
