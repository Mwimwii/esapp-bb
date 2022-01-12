import { Agreement, Payment, PaymentPlan } from '../../models';
import { readJotFormValue } from '../../utils/jotform/readJotFormValue';
import {
  PaymentType,
  PaymentCycle,
  PaymentCurrency,
  PaymentPlanStatus,
  PaymentMethod,
  PaymentStatus,
} from '@titl-all/shared/dist/enum';

export function readOldKanzuPaymentPlan(record: any, agreement: Agreement): PaymentPlan {
  if (readJotFormValue(record, 184, null)) {
    const kanzuPaymentPlan = ({
      paymentType: PaymentType.kanzu,
      baseAmount: readJotFormValue(record, 184, null) || 0,
      agreedAmount: readJotFormValue(record, 184, null) || 0,
      effectiveDate: agreement.dateArrived || record.created_at,
      cycle: PaymentCycle.oneoff,
      currency: PaymentCurrency.ugx,
      status: (readJotFormValue(record, 24, null) === 'YES') ? PaymentPlanStatus.completed : PaymentPlanStatus.active,
      payments: []
    } as unknown) as PaymentPlan;

    if (readJotFormValue(record, 149, null)) {
      kanzuPaymentPlan.payments.push({
        paymentType: PaymentType.kanzu,
        paidBy: agreement.tenant.firstName,
        amount: readJotFormValue(record, 149, 2) || 0,
        paidTo: readJotFormValue(record, 149, 3),
        paymentMethod: PaymentMethod.cash,
        status: PaymentStatus.completed
      } as Payment);
    }
    return kanzuPaymentPlan;
  }
  return new PaymentPlan();
}
