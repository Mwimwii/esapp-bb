import { Agreement, PaymentPlan } from '../../models';
import { readJotFormValue } from '../../utils/jotform/readJotFormValue';
import {
  PaymentType,
  PaymentCurrency,
  PaymentPlanStatus,
} from '@titl-all/shared/dist/enum';
import { mapJotFormPaymentCylce } from './mapJotFormPaymentCylce';


export function readProposedBuyOutPlan(record: any, agreement: Agreement): PaymentPlan {
  if (readJotFormValue(record, 163, null)) {
    return ({
      agreement: agreement,
      paymentType: PaymentType.buyout,
      baseAmount: readJotFormValue(record, 163, null) || 0,
      requestedAmount: readJotFormValue(record, 163, null) || 0,
      agreedAmount: readJotFormValue(record, 163, null) || 0,
      effectiveDate: record.updated_at || record.created_at,
      cycle: mapJotFormPaymentCylce(readJotFormValue(record, 42)),
      currency: PaymentCurrency.ugx,
      status: PaymentPlanStatus.active,
      payments: []
    } as unknown) as PaymentPlan;
  }
  return new PaymentPlan();
}
