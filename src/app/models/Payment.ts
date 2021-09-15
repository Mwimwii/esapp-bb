import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { PaymentPlan } from './PaymentPlan';
import { BaseTable } from './BaseTable';
import { PaymentType } from './PaymentType';
import { PaymentMethod } from './PaymentMethod';
import { PaymentStatus } from './PaymentStatus';
import { User } from '.';

@Entity()
export class Payment extends BaseTable {
    @JoinColumn()
    @OneToOne(() => PaymentPlan)
    paymentPlan: PaymentPlan;

    @Column()
    paymentType: PaymentType;

    @Column()
    paidBy: string;

    @Column('numeric')
    amount: number;

    @Column('timestamp')
    initiationDate: Date;

    @Column('timestamp')
    completionDate: Date;

    @Column()
    paymentMethod: PaymentMethod;

    @Column()
    paidTo: string;

    @Column()
    paymentReference: string;

    @Column('timestamp')
    verifiedAt: string = new Date().toISOString();

    @JoinColumn()
    @Column(() => User)
    verifiedBy: User;

    @Column()
    status: PaymentStatus;

}