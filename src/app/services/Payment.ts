import { OnboardingQuestions } from '@titl-all/shared/dist/types';

import {
  Agreement,
  PaymentPlan,
} from 'app/models';
import { PaymentCycle } from '@titl-all/shared/dist/enum';

interface PaymentInfo {
  baseAmount: number;
  amountPaid: number;
}

export class PaymentService {
  add(data: Partial<OnboardingQuestions>, agreement: Agreement) {
    const {
      kanzuBaseAmount,
      kanzuAmountPaid,
      busuluBaseAmount,
      busuluAmountPaid,
      paymentCycle,
    } = data;

    const kanzuInfo: PaymentInfo = { baseAmount: Number(kanzuBaseAmount), amountPaid: Number(kanzuAmountPaid) };
    const busuluInfo: PaymentInfo = { baseAmount: Number(busuluBaseAmount), amountPaid: Number(busuluAmountPaid) };

    [kanzuInfo, busuluInfo].map((info: PaymentInfo) => {
      const createdPaymentPlan = new PaymentPlan();
      createdPaymentPlan.baseAmount = info.baseAmount
      createdPaymentPlan.requestedAmount = info.baseAmount - info.amountPaid;
      createdPaymentPlan.agreement = agreement;
      createdPaymentPlan.cycle = paymentCycle as PaymentCycle;

      createdPaymentPlan.save();
    });

  }
}
