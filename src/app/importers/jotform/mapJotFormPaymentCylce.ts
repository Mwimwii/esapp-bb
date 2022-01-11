import { PaymentCycle } from '@titl-all/shared/dist/enum';
import { mapPaymentCylce } from '../../utils/mapPaymentCylce';


export function mapJotFormPaymentCylce(cycle: any): PaymentCycle {
    if (!cycle || cycle.lenth < 1) {
        return PaymentCycle.monthly;
    }

    return mapPaymentCylce(cycle[0].toLowerCase());
}
