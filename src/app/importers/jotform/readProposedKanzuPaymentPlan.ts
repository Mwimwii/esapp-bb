import { Agreement, PaymentPlan } from '../../models';
import { readJotFormValue } from '../../utils/jotform/readJotFormValue';
import {
  PaymentType,
  PaymentCurrency,
  PaymentPlanStatus,
} from '@titl-all/shared/dist/enum';
import { mapJotFormPaymentCylce } from './mapJotFormPaymentCylce';

export function readProposedKanzuPaymentPlan(record: any, agreement: Agreement): PaymentPlan {
  const result = new PaymentPlan();
  if (readJotFormValue(record, 161, null)) {
    result.agreement = agreement;
    result.paymentType = PaymentType.kanzu;
    result.baseAmount = readJotFormValue(record, 184, null) || 0;
    result.requestedAmount = readJotFormValue(record, 161, null) || 0;
    result.agreedAmount = readJotFormValue(record, 161, null) || 0;
    result.effectiveDate = record.updated_at || record.created_at;
    result.cycle = mapJotFormPaymentCylce(readJotFormValue(record, 197));
    result.currency = PaymentCurrency.ugx;
    result.status = PaymentPlanStatus.active;
    result.payments = [];
  }
  return result;
}
