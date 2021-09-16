import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { PaymentPlan } from './PaymentPlan';
import { BaseTable } from './BaseTable';
import { User } from '.';
import { PaymentMethod } from 'app/enums/PaymentMethod';
import { PaymentStatus } from 'app/enums/PaymentStatus';
import { PaymentType } from 'app/enums/PaymentType';

@Entity()
export class Payment extends BaseTable {
    @JoinColumn()
    @ManyToOne(() => PaymentPlan)
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