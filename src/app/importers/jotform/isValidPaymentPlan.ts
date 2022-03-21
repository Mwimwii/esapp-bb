import { PaymentPlan } from '../../models';

export function isValidPaymentPlan(paymentPlan: PaymentPlan): boolean {
  if (!paymentPlan) {
    return false;
  }

  return (paymentPlan.baseAmount != 0 && paymentPlan.agreedAmount != 0 && paymentPlan.requestedAmount != 0);
}
