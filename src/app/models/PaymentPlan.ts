import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Agreement } from './Agreement';
import { BaseTable } from './BaseTable';
import { PaymentCurrency } from '../enums/PaymentCurrency';
import { PaymentCycle } from '../enums/PaymentCycle';
import { PaymentPlanStatus } from '../enums/PaymentPlanStatus';
import { PaymentType } from '../enums/PaymentType';



@Entity()
export class PaymentPlan extends BaseTable {

    @JoinColumn()
    @ManyToOne(() => Agreement)
    agreement: Agreement;

    @Column({ type: 'enum', enum: PaymentType })
    paymentType: PaymentType;

    @Column('numeric', { nullable: true })
    baseAmount: number;

    @Column('numeric', { nullable: true })
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

    @Column('int', { nullable: true, default: 0 })
    gracePeriod: number;

    @Column('int', { nullable: true, default: 0 })
    breachPeriod: number;

    @Column('int', { nullable: true })
    priority = 0;

    @Column({ default: false })
    blocking: boolean;

    @Column('numeric', { default: 0 })
    negotiatedFXRate: number;

    @Column('numeric', { default: 0 })
    outstandingAmount: number;

    @Column({ type: 'enum', enum: PaymentPlanStatus })
    status: PaymentPlanStatus;

}