import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { Contact, PaymentPlan, Property, Comment, Asset } from '.';
import { BaseTable } from './BaseTable';
import {
  AgreementStatus,
  AgreementType,
  AcquisitionType,
  PropertyUseType,
} from '@titl-all/shared/dist/enum';

import { AgreementAPI } from '@titl-all/shared/dist/api-model';

@Entity({ name: 'agreements' })
export class Agreement extends BaseTable implements AgreementAPI {
  fieldsNoRelations() {
    return {
      secondaryTenantsWithoutSignatoryRights: this.secondaryTenantsWithoutSignatoryRights,
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

  @Column({ default: true })
  registeredTenantHasSignatoryRights: boolean;

  @JoinTable()
  @ManyToMany(() => Contact)
  secondaryTenantsWithSignatoryRights: Contact[];

  @JoinTable()
  @ManyToMany(() => Contact)
  secondaryTenantsWithoutSignatoryRights: Contact[];

  @OneToMany(() => PaymentPlan, paymentPlan => paymentPlan.agreement, { cascade: true })
  paymentPlans: PaymentPlan[];

  @OneToMany(() => Comment, comment => comment.agreement, { cascade: true })
  comments: Comment[];

  @Column('date', { nullable: true })
  dateArrived: Date;

  @Column('boolean', { nullable: true })
  coOwnership: boolean;

  @Column({ type: 'enum', array: true, enum: AgreementType, nullable: true })
  requestedAgreementType: AgreementType[];

  @Column({ type: 'simple-array', nullable: true })
  otherAgreementTypes: AgreementType[];

  @Column({ type: 'enum', enum: AgreementType, nullable: true })
  agreementType: AgreementType;

  @Column({ type: 'enum', enum: AcquisitionType, nullable: true })
  acquisitionType: AcquisitionType;

  @Column({ type: 'simple-array', nullable: true })
  propertyUseType: PropertyUseType[];

  @Column({ type: 'enum', enum: AgreementStatus, nullable: true })
  status: AgreementStatus;

  @Column({ type: 'simple-array', nullable: true })
  namedNeighbors: string[];

  @Column({ type: 'simple-array', nullable: true })
  namedVerifiers: string[];

  @Column({ default: false })
  termsAccepted: boolean;

  @Column({ default: false })
  hasContentFormImages: boolean;

  @Column({ default: false })
  hasAgreementImage: boolean;

  @Column({ type: 'simple-array', nullable: true })
  namedVerifiers: string[];

  @Column({ type: 'text', nullable: true })
  negotiationType: string;

  @Column({ type: 'simple-array', nullable: true })
  heardAboutUs: string[];

  @Column({ type: 'text', nullable: true })
  employeeName: string;

  @OneToMany(() => Asset, ((asset: Asset) => asset.ownedByAgreement), { cascade: true })
  assets: Asset[];

  // Airtable.TenantID connects to Contact.airTableId
  @Column({ nullable: true })
  airTableTenantId: string;
}
