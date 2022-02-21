import { OnboardingQuestions } from '@titl-all/shared/dist/types';

import { Agreement, PaymentPlan, User } from 'app/models';
import {
  PaymentCycle,
  PaymentPlanStatus,
  PaymentCurrency,
} from '@titl-all/shared/dist/enum';

interface PaymentInfo {
  baseAmount: number;
  amountPaid: number;
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
    } = data;

    const kanzuInfo: PaymentInfo = {
      baseAmount: Number(kanzuBaseAmount),
      amountPaid: Number(kanzuAmountPaid),
    };
    const groundRentInfo: PaymentInfo = {
      baseAmount: Number(groundRentBaseAmount),
      amountPaid: Number(groundRentAmountPaid),
    };
    const kibanjaPriceInfo: PaymentInfo = {
      baseAmount: Number(purchasePrice),
      amountPaid: Number(purchasePrice),
    };

    [kanzuInfo, groundRentInfo, kibanjaPriceInfo].map(
      async (info: PaymentInfo) => {
        const createdPaymentPlan = new PaymentPlan();
        createdPaymentPlan.baseAmount = info.baseAmount;
        createdPaymentPlan.requestedAmount = info.baseAmount - info.amountPaid;
        createdPaymentPlan.agreement = agreement;
        createdPaymentPlan.cycle = paymentCycle as PaymentCycle;
        createdPaymentPlan.status = PaymentPlanStatus.active;
        createdPaymentPlan.currency = PaymentCurrency.ugx;
        createdPaymentPlan.createdBy = user;

        await createdPaymentPlan.save();
      }
    );
  }
}
