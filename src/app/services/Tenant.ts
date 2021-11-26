import { File } from '@foal/storage';

import { OnboardingQuestions } from '@titl-all/shared/dist/types';
import { Language, ContactType } from '@titl-all/shared/dist/enum';
import { User, Contact } from '@titl-all/database-models/dist/models';

export class TenantService {
  add(data: Partial<OnboardingQuestions>, picture: File, user: User) {
    const {
      firstName,
      lastName,
      nickname,
      gender,
      dateOfBirth,
      tenantType: contactType,
      languages,
    } = data;

    console.log(picture)

    const tenantContact = new Contact();

    tenantContact.firstName = String(firstName);
    tenantContact.lastName = String(lastName);
    tenantContact.nickName = String(nickname);
    tenantContact.gender = String(gender);
    tenantContact.dob = new Date(String(dateOfBirth));
    if (contactType && contactType.length > 0) {
      // format this
      //tenantContact.contactType = contactType[0];
      tenantContact.contactType = 'Tenant' as ContactType;
    }
    // format this
    tenantContact.languages = languages as Language[];
    tenantContact.createdBy = user;

    tenantContact.save();
  }
}
