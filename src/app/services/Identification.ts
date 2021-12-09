import { OnboardingQuestions } from '@titl-all/shared/dist/types';
import { IdentificationType, IdentificationStatus } from '@titl-all/shared/dist/enum';
import { getCodesForIdentification } from 'app/utils';
import { Contact, Identification, User } from 'app/models';
import { OnboardingFiles } from 'app/types';

export class IdentificationService {
  async add(
    data: Partial<OnboardingQuestions>,
    files: OnboardingFiles,
    contact: Contact,
    user: User,
  ) {
    const {
      identificationType,
      identificationNumber,
      identificationExpirationDate: expirationDate,
    } = data;

    const { identificationImageFront, identificationImageBack } = files;

    const codes = getCodesForIdentification(String(identificationType));
    const id = new Identification();
    id.identificationType = codes.assetType as unknown as IdentificationType;
    id.status = IdentificationStatus.underreview;
    id.identificationNumber = String(identificationNumber);
    id.expirationDate = new Date(String(expirationDate));
    id.contact = contact;
    id.createdBy = user;

    if (identificationImageFront && identificationImageBack) {
      id.hasIdentificationImages = true;
    }

    await id.save();
  }
}
