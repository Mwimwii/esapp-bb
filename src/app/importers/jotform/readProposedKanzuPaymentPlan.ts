import { Agreement, PaymentPlan } from '../../models';
import { readJotFormValue } from '../../utils/jotform/readJotFormValue';
import {
  PaymentType,
  PaymentCurrency,
  PaymentPlanStatus,
} from '@titl-all/shared/dist/enum';
import { mapJotFormPaymentCylce } from './mapJotFormPaymentCylce';

export function readProposedKanzuPaymentPlan(record: any, agreement: Agreement): any {
  if (readJotFormValue(record, 161, null)) {
    return ({
      agreement: agreement,
      paymentType: PaymentType.kanzu,
      baseAmount: readJotFormValue(record, 184, null) || 0,
      requestedAmount: readJotFormValue(record, 161, null) || 0,
      agreedAmount: readJotFormValue(record, 161, null) || 0,
      effectiveDate: record.updated_at || record.created_at,
      cycle: mapJotFormPaymentCylce(readJotFormValue(record, 197)),
      currency: PaymentCurrency.ugx,
      status: PaymentPlanStatus.active,
      payments: []
    } as unknown) as PaymentPlan;

  }
}
