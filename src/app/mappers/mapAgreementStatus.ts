import { AgreementStatus } from '@titl-all/shared/dist/enum';

export function mapAgreementStatus(val: string): AgreementStatus {
  switch (val) {
    case 'Been contacted, no answer':
      return AgreementStatus.contactedfail;
    case 'Been contacted':
      return AgreementStatus.contactedfail;
    case 'Planned negotiation time':
      return AgreementStatus.negplanned;
    case 'Performed physical negotiation':
      return AgreementStatus.negperformed;
    case 'Agreed with landowner':
      return AgreementStatus.negagreed;
    case 'Complete access to USSD':
      return AgreementStatus.identified;
    case 'Missing documentation, post negotiation':
      return AgreementStatus.negmissingdocs;
    case 'Ready For Landlord Review':
      return AgreementStatus.negready;
    case 'Identified':
    default:
      return AgreementStatus.identified
  }
}