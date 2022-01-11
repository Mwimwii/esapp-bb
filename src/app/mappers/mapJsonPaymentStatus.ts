import { PaymentStatus } from '@titl-all/shared/dist/enum';

export function mapJsonPaymentStatus(Status: any): PaymentStatus {
  switch (Status) {
    case 2:
      return PaymentStatus.completed;
    case 3:
      return PaymentStatus.error;
    default:
      return PaymentStatus.pending;
  }
}
