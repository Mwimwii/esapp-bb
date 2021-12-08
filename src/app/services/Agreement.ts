import { File } from '@foal/storage';

import { OnboardingQuestions } from '@titl-all/shared/dist/types';
import { PropertyUseType, AgreementType, AcquisitionType } from '@titl-all/shared/dist/enum';
import {
  Contact as Tenant,
  Property,
  Agreement,
} from 'app/models';

export class AgreementService {
  add(
    data: Partial<OnboardingQuestions>,
    agreementImage: File,
    consentImageFront: File,
    consentImageBack: File,
    property: Property,
    tenant: Tenant) {
    const {
      agreementType,
      dateArrived,
      propertyUse: propertyUseType,
      acquisitionType,
      requestedAgreementType,
      terms: termsAccepted,
    } = data;

    const createdAgreement = new Agreement();

    createdAgreement.property = property;
    createdAgreement.tenant = tenant;
    createdAgreement.dateArrived = new Date(String(dateArrived));
    createdAgreement.agreementType = agreementType as AgreementType;
    createdAgreement.acquisitionType = acquisitionType as AcquisitionType;
    createdAgreement.propertyUseType = String(propertyUseType).split(',') as PropertyUseType[];
    createdAgreement.requestedAgreementType = this.mapRequestedAgreementType(String(requestedAgreementType)) as AgreementType[];
    createdAgreement.termsAccepted = termsAccepted === 'Yes';

    if (consentImageFront && consentImageBack) {
      createdAgreement.hasContentFormImages = true;
    }

    if (agreementImage) {
      createdAgreement.hasAgreementImage = true;
    }

    createdAgreement.save();

    return createdAgreement;
  }

  mapRequestedAgreementType(requestedAgreementType: string) {
    const types = requestedAgreementType.split(',');
    const agreeementTypesArr = types.map((type: string) => {
      switch(type) {
        case 'Pay Busulu':
          return AgreementType.kibanja;
        case 'Turn to leasehold':
          return AgreementType.lease;
        case 'Buy-out owner':
          return AgreementType.buyout;
        case 'Be compensated by owner':
          return AgreementType.compensation;
        default:
          return '';
      }
    });

    return agreeementTypesArr;
  }
}
