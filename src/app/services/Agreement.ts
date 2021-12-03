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

    // upload agreementImage to AWS
    console.log(agreementImage);
    const createdAgreement = new Agreement();

    createdAgreement.property = property;
    createdAgreement.tenant = tenant;
    createdAgreement.dateArrived = new Date(String(dateArrived));
    createdAgreement.agreementType = agreementType as AgreementType;
    createdAgreement.acquisitionType = acquisitionType as AcquisitionType;
    createdAgreement.propertyUseType = propertyUseType as PropertyUseType[];
    createdAgreement.requestedAgreementType = requestedAgreementType as AgreementType[];
    createdAgreement.termsAccepted = termsAccepted === 'Yes';

    if (consentImageFront && consentImageBack) {
      createdAgreement.hasContentFormImages = true;
    }

    createdAgreement.save();

    return createdAgreement;
  }
}
