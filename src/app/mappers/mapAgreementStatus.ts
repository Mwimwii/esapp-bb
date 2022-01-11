import { AgreementStatus } from '@titl-all/shared/dist/enum';

export function mapAgreementStatus(val: string): AgreementStatus {
    switch (val) {
        case 'Agreed with landowner':
            return AgreementStatus.negagreed;
        case 'Been contacted':
            return AgreementStatus.contacted;
        case 'Missing documentation, post negotiation':
            return AgreementStatus.negmissingdocs;
        case 'Performed physical negotiation':
            return AgreementStatus.negperformed;
        case 'Planned negotiation time':
            return AgreementStatus.negplanned;
        default:
            return AgreementStatus.active;
    }
}
