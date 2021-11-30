import { OnboardingQuestions } from '@titl-all/shared/dist/types';

import {
  Agreement,
  PaymentPlan,
} from 'app/models';
import { PaymentCycle } from '@titl-all/shared/dist/enum';

export class PaymentService {
  add(data: Partial<OnboardingQuestions>, agreement: Agreement) {
    const {
      kanzuBaseAmount: baseAmount,
      payment: cycle
    } = data;

    const createdPaymentPlan = new PaymentPlan();

    createdPaymentPlan.agreement = agreement;
    createdPaymentPlan.baseAmount = Number(baseAmount);
    // this should be a single value
    createdPaymentPlan.cycle = Array.isArray(cycle) ? cycle[0] as PaymentCycle : cycle as unknown as PaymentCycle;

    createdPaymentPlan.save();
  }
}
