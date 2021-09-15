import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Agreement } from './Agreement';
import { BaseTable } from './BaseTable';
import { PaymentCurrency } from '../enums/PaymentCurrency';
import { PaymentCycle } from 'app/enums/PaymentCycle';
import { PaymentPlanStatus } from 'app/enums/PaymentPlanStatus';
import { PaymentType } from 'app/enums/PaymentType';



@Entity()
export class PaymentPlan extends BaseTable {

    @JoinColumn()
    @ManyToOne(() => Agreement)
    agreement: Agreement;

    @Column()
    paymentType: PaymentType;

    @Column('numeric')
    baseAmount: number;

    @Column('numeric')
    agreedAmount: number;

    @Column('timestamp', { nullable: true })
    effectiveDate: Date;

    @Column('timestamp', { nullable: true })
    dueDate: Date;

    @Column('timestamp', { nullable: true })
    paidUpUntil: Date;

    @Column()
    cycle: PaymentCycle;

    @Column()
    currency: PaymentCurrency;

    @Column('int')
    gracePeriod: number;

    @Column('int')
    breachPeriod: number;

    @Column('int')
    priority = 0;

    @Column()
    blocking: boolean;

    @Column('numeric')
    negotiatedFXRate: number;

    @Column('numeric')
    outstandingAmount: number;

    @Column()
    status: PaymentPlanStatus;

}