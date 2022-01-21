import { PaymentStatus } from '@titl-all/shared/dist/enum';

export function mapAirtelPaymentStatus(status: any): PaymentStatus {
  if (!status) {
    return PaymentStatus.pending;
  }

  switch (status) {
    case 'Transaction Success':
    case 'Successful':
      return PaymentStatus.completed;
    default:
      return PaymentStatus.pending;
  }
}
