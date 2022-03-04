import { OnboardingQuestions } from '@titl-all/shared/dist/types';

import { Agreement, Payment, PaymentPlan, User } from 'app/models';
import {
  PaymentCycle,
  PaymentPlanStatus,
  PaymentCurrency,
  PaymentMethod,
  PaymentType,
  PaymentStatus,
} from '@titl-all/shared/dist/enum';

interface PaymentInfo {
  baseAmount: number;
  amountPaid: number;
  paidTo?: string;
  paymentType: PaymentType;
  paymentStatus: PaymentStatus;
}

export class PaymentService {
  async add(
    data: Partial<OnboardingQuestions>,
    agreement: Agreement,
    user: User
  ) {
    const {
      kanzuBaseAmount,
      kanzuAmountPaid,
      groundRentBaseAmount,
      groundRentAmountPaid,
      paymentCycle,
      purchasePrice,
      kanzuPaidTo,
    } = data;

    const kanzuInfo: PaymentInfo = {
      baseAmount: Number(kanzuBaseAmount),
      amountPaid: Number(kanzuAmountPaid),
      paidTo: String(kanzuPaidTo),
      paymentType: PaymentType.kanzu,
      paymentStatus: PaymentStatus.completed,
    };
    const groundRentInfo: PaymentInfo = {
      baseAmount: Number(groundRentBaseAmount),
      amountPaid: Number(groundRentAmountPaid),
      paidTo: '',
      paymentType: PaymentType.busulu,
      paymentStatus: PaymentStatus.completed,
    };
    const kibanjaPriceInfo: PaymentInfo = {
      baseAmount: Number(purchasePrice),
      amountPaid: Number(purchasePrice),
      paidTo: '',
      paymentType: PaymentType.busulu,
      paymentStatus: PaymentStatus.completed,
    };

    [kanzuInfo, groundRentInfo, kibanjaPriceInfo].map(
      async (info: PaymentInfo) => {
        const createdPaymentPlan = new PaymentPlan();
        createdPaymentPlan.payments = [];
        createdPaymentPlan.baseAmount = info.baseAmount;
        createdPaymentPlan.requestedAmount = info.baseAmount - info.amountPaid;
        createdPaymentPlan.agreement = agreement;
        createdPaymentPlan.cycle = paymentCycle as PaymentCycle;
        createdPaymentPlan.status = PaymentPlanStatus.active;
        createdPaymentPlan.currency = PaymentCurrency.ugx;
        createdPaymentPlan.createdBy = user;

        const createdPayment = new Payment();
        createdPayment.amount = info.amountPaid;
        createdPayment.paidTo = String(kanzuPaidTo);
        createdPayment.paymentMethod = PaymentMethod.cash;
        createdPayment.paymentType = info.paymentType;
        createdPayment.status = info.paymentStatus;

        createdPaymentPlan.payments.push(createdPayment);

        console.log(createdPaymentPlan);
        await createdPaymentPlan.save();
      }
    );
  }
}
