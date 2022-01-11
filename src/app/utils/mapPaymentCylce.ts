import { PaymentCycle } from '@titl-all/shared/dist/enum';

export function mapPaymentCylce(cycle: string): PaymentCycle {
    if (!cycle) {
        return PaymentCycle.monthly;
    }

    switch (cycle) {
        case 'yearly':
            return PaymentCycle.yearly;
        case 'twice a year':
            return PaymentCycle.twiceyear;
        case 'every other week':
            return PaymentCycle.otherweekly;
        case 'monthly':
        default:
            return PaymentCycle.monthly;
    }
}
