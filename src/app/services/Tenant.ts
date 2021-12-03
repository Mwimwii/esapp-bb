import { File } from '@foal/storage';

import { OnboardingQuestions } from '@titl-all/shared/dist/types';
import { Language, ContactType } from '@titl-all/shared/dist/enum';
import { User, Contact } from 'app/models';

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

    if (picture) {
      tenantContact.hasPicture = true;
      // upload pictures in the correct naming format
    }
    tenantContact.languages = this.formatLanguages(languages);
    tenantContact.createdBy = user;

    tenantContact.save();

    return tenantContact;
  }

  formatLanguages(languages?: string[]): Language[] {
    const formattedLanguages = languages?.map(language => {
      switch(language) {
        case 'English':
          return Language.English;
        case 'Luganda':
          return Language.Luganda;
        case 'Swahali':
          return Language.Swahali;
        default:
          return '';
      }
    });

    return formattedLanguages as Language[];
  }
}
