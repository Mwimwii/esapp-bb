import { Agreement, PaymentPlan } from '../../models';
import { readJotFormDate } from '../../utils/jotform/readJotFormDate';
import { readJotFormValue } from '../../utils/jotform/readJotFormValue';
import {
  PaymentType,
  PaymentCurrency,
  PaymentPlanStatus,
} from '@titl-all/shared/dist/enum';
import { mapJotFormPaymentCylce } from './mapJotFormPaymentCylce';

export function readOldGroundRentPaymentPlan(
  record: any,
  agreement: Agreement
): any {
  if (readJotFormValue(record, 185, null)) {
    const oldBusuluPaymentPlan = ({
      paymentType: PaymentType.groundrent,
      baseAmount: readJotFormValue(record, 185, null) || 0,
      requestedAmount: readJotFormValue(record, 31, null) || 0,
      agreedAmount: readJotFormValue(record, 31, null) ||
        readJotFormValue(record, 185, null),
      effectiveDate: agreement.dateArrived || record.created_at,
      cycle: mapJotFormPaymentCylce(readJotFormValue(record, 42)),
      currency: PaymentCurrency.ugx,
      status: PaymentPlanStatus.active,
      payments: [],
    } as unknown) as PaymentPlan;

    if (readJotFormDate(record, 152)) {
      oldBusuluPaymentPlan.paidUpUntil = readJotFormDate(record, 152);
    }
    return oldBusuluPaymentPlan;
  }
}
