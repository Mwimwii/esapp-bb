import { AgreementType } from '@titl-all/shared/dist/enum';

export function mapAgreementType(val: string): AgreementType {
  if (!val) {
    return AgreementType.lease;
  }

  switch (val) {
    case 'buyout':
      return AgreementType.buyout;
    case 'pay busulu':
      return AgreementType.customary;
    default:
      return AgreementType.kibanja;
  }
}
