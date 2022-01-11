import { PaymentType } from '@titl-all/shared/dist/enum';

export function mapXLPaymentType(paidFor: any): PaymentType {
  if (!paidFor) {
    return PaymentType.unknown;
  }

  switch (paidFor.trim().toLowerCase()) {
    case 'kanzu':
      return PaymentType.kanzu;
    case 'rent':
      return PaymentType.rent;
    case 'busulu':
    default:
      return PaymentType.busulu;
  }
}
