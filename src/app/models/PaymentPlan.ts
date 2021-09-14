import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Agreement } from './Agreement';
import { BaseTable } from './BaseTable';


@Entity()
export class PaymentPlan extends BaseTable {

    @JoinColumn()
    @OneToOne(() => Agreement)
    agreement: Agreement;

    @Column()
    paymentType: string;

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
    cycle: string;

    @Column()
    currency: string;

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

}