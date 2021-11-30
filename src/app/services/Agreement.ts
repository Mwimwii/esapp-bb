import { File } from '@foal/storage';

import { OnboardingQuestions } from '@titl-all/shared/dist/types';
import { PropertyUseType, AgreementType } from '@titl-all/shared/dist/enum';
import {
  Contact as Tenant,
  Property,
  Agreement,
} from 'app/models';

export class AgreementService {
  add(data: Partial<OnboardingQuestions>, agreementImage: File, property: Property, tenant: Tenant) {
    const {
      agreementType,
      dateArrived,
      propertyUse: propertyUseType,
    } = data;

    // upload agreementImage to AWS
    console.log(agreementImage);
    const createdAgreement = new Agreement();

    createdAgreement.property = property;
    createdAgreement.tenant = tenant;
    createdAgreement.dateArrived = new Date(String(dateArrived));
    createdAgreement.agreementType = agreementType as AgreementType;
    createdAgreement.propertyUseType = propertyUseType as PropertyUseType[];

    createdAgreement.save();

    return createdAgreement;
  }
}
