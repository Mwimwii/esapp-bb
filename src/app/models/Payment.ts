import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { PaymentPlan, User } from '.';
import { BaseTable } from './BaseTable';
import { PaymentMethod } from '../enums/PaymentMethod';
import { PaymentStatus } from '../enums/PaymentStatus';
import { PaymentType } from '../enums/PaymentType';

@Entity()
export class Payment extends BaseTable {
    @JoinColumn()
    @ManyToOne(() => PaymentPlan)
    paymentPlan: PaymentPlan;

    @Column({ type: 'enum', enum: PaymentType })
    paymentType: PaymentType;

    @Column()
    paidBy: string;

    @Column('numeric')
    amount: number;

    @Column('timestamp')
    initiationDate: Date;

    @Column('timestamp')
    completionDate: Date;

    @Column({ type: 'enum', enum: PaymentMethod })
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

    @Column({ type: 'enum', enum: PaymentStatus })
    status: PaymentStatus;

}
