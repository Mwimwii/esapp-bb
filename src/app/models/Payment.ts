import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { PaymentPlan, User } from '.';
import { BaseTable } from './BaseTable';
import {
  PaymentMethod,
  PaymentStatus,
  PaymentType,
} from '@titl-all/shared/dist/enum';
import { PaymentAPI } from '@titl-all/shared/dist/api-model';

@Entity({ name: 'payments' })
export class Payment extends BaseTable implements PaymentAPI {
  @JoinColumn()
  @ManyToOne(() => PaymentPlan)
  paymentPlan: PaymentPlan;

  @Column({ type: 'enum', enum: PaymentType })
  paymentType: PaymentType;

  @Column({ nullable: true })
  paidBy: string;

  @Column({ nullable: true })
  paidWithAccount: string;

  @Column('numeric')
  amount: number;

  @Column('timestamp', { nullable: true })
  initiationDate: Date;

  @Column('timestamp', { nullable: true })
  completionDate: Date;

  @Column({ type: 'enum', enum: PaymentMethod })
  paymentMethod: PaymentMethod;

  @Column({ nullable: true })
  paidTo: string;

  @Column({ nullable: true })
  paymentReference: string;

  @Column({ nullable: true })
  narration: string;

  @Column('timestamp', { nullable: true })
  verifiedAt: string = new Date().toISOString();

  @JoinColumn()
  @Column(() => User)
  verifiedBy: User;

  @Column({ type: 'enum', enum: PaymentStatus })
  status: PaymentStatus;

  // Delete after import
  @Column({ nullable: true })
  xlSheetName: string;
}
