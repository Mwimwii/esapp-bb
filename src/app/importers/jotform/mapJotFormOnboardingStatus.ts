import { AgreementStatus } from '@titl-all/shared/dist/enum';

export function mapJotFormOnboardingStatus(onBoardingStatus: string): AgreementStatus {
  switch (onBoardingStatus) {
    case 'negagreed':
      return AgreementStatus.negagreed;
    case 'negcounteroffer':
      return AgreementStatus.negplanned;
    case 'negmissingdocs':
      return AgreementStatus.negmissingdocs;
    case 'negmissingdocs':
      return AgreementStatus.negmissingdocs;
    default:
      return AgreementStatus.negperformed;
  }
}
