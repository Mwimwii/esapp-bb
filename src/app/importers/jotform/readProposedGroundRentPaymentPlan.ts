import { Agreement, PaymentPlan } from '../../models';
import { readJotFormValue } from '../../utils/jotform/readJotFormValue';
import {
  PaymentType,
  PaymentCurrency,
  PaymentPlanStatus,
} from '@titl-all/shared/dist/enum';
import { mapJotFormPaymentCylce } from './mapJotFormPaymentCylce';

export function readProposedGroundRentPaymentPlan(record: any, agreement: Agreement): PaymentPlan {
  if (readJotFormValue(record, 160, null)) {
    return ({
      agreement: agreement,
      paymentType: PaymentType.groundrent,
      baseAmount: readJotFormValue(record, 185, null) || 0,
      requestedAmount: readJotFormValue(record, 160, null) || 0,
      agreedAmount: readJotFormValue(record, 160, null) || 0,
      effectiveDate: record.updated_at || record.created_at,
      cycle: mapJotFormPaymentCylce(readJotFormValue(record, 197)),
      currency: PaymentCurrency.ugx,
      status: PaymentPlanStatus.active,
      payments: []
    } as unknown) as PaymentPlan;
  }
  return new PaymentPlan();
}
