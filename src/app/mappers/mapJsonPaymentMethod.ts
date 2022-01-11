import { PaymentMethod } from '@titl-all/shared/dist/enum';

export function mapJsonPaymentMethod(Phone: any): PaymentMethod {
  switch (Phone.substr(0, 5)) {
    case '25670':
    case '25675':
      return PaymentMethod.airtelmoney;
    case '25677':
    case '25678':
      return PaymentMethod.momocollections;
    default:
      return PaymentMethod.momoopen;
  }
}
