import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Agreement, Payment } from '.';
import { BaseTable } from './BaseTable';
import {
  PaymentCurrency,
  PaymentCycle,
  PaymentPlanStatus,
  PaymentType,
} from '@titl-all/shared/dist/enum';

import { PaymentPlanAPI } from '@titl-all/shared/dist/api-model';

@Entity({ name: 'payment_plans' })
export class PaymentPlan extends BaseTable implements PaymentPlanAPI {

    @JoinColumn()
    @ManyToOne(() => Agreement)
    agreement: Agreement;

    @Column({ type: 'enum', enum: PaymentType })
    paymentType: PaymentType;

    @Column('numeric', { default: 0 })
    baseAmount: number;

    @Column('numeric', { nullable: true, default: 0 })
    requestedAmount: number;

    @Column('numeric', { default: 0 })
    agreedAmount: number;

    @Column('timestamp', { nullable: true })
    effectiveDate: Date;

    @Column('timestamp', { nullable: true })
    dueDate: Date;

    @Column('timestamp', { nullable: true })
    paidUpUntil: Date;

    @Column({ type: 'enum', enum: PaymentCycle, nullable: true })
    cycle: PaymentCycle;

    @Column({ type: 'enum', enum: PaymentCurrency })
    currency: PaymentCurrency;

    @Column('int', { default: 0 })
    gracePeriod: number;

    @Column('int', { default: 0 })
    breachPeriod: number;

    @Column('int', { default: 0 })
    priority = 0;

    @Column({ default: false })
    blocking: boolean;

    @Column('numeric', { default: 0 })
    negotiatedFXRate: number;

    @Column('numeric', { default: 0 })
    outstandingAmount: number;

    @Column({ type: 'enum', enum: PaymentPlanStatus })
    status: PaymentPlanStatus;

    @OneToMany(() => Payment, payment => payment.paymentPlan, { cascade: true })
    payments: Payment[];

}
