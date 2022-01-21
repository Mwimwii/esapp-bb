import { PaymentPlanStatus } from '@titl-all/shared/dist/enum';

export function mapPaymentPlanStatus(status: string): PaymentPlanStatus {
    if (!status) {
        return PaymentPlanStatus.unknown;
    }

    switch (status) {
        case 'paid':
            return PaymentPlanStatus.paid;
        case 'unpaid':
            return PaymentPlanStatus.unpaid;
        case 'undocumented':
            return PaymentPlanStatus.undocumented;
        case 'partially paid':
        case 'partially-paid':
            return PaymentPlanStatus.partially;
        default:
            return PaymentPlanStatus.unknown;
    }
}
