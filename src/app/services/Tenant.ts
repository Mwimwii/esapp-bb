import { File } from '@foal/storage';

import { OnboardingQuestions } from '@titl-all/shared/dist/types';
import {
  Language,
  ContactType,
  ContactDetailStatus,
  ContactDetailType,
} from '@titl-all/shared/dist/enum';
import { User, Contact, ContactDetail } from 'app/models';

export class TenantService {
  async add(data: Partial<OnboardingQuestions>, picture: File, user: User) {
    const {
      firstName,
      lastName,
      firstPhoneNumber,
      firstNumberIsWhatsApp,
      secondPhoneNumber,
      secondNumberIsWhatsApp,
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

    if (contactType) {
      // split(',')
      tenantContact.contactType = ContactType.tenant;
    }

    tenantContact.hasPicture = Boolean(picture);

    tenantContact.languages = languages ? this.formatLanguages(String(languages).split(',')) : [];
    tenantContact.createdBy = user;

    const createdContactDetailFirstPhoneNum = new ContactDetail();
    createdContactDetailFirstPhoneNum.contactDetailType =
      firstNumberIsWhatsApp === 'Yes'
        ? ContactDetailType.whatsapp
        : ContactDetailType.phone;
    createdContactDetailFirstPhoneNum.contactDetailValue =
      String(firstPhoneNumber);
    createdContactDetailFirstPhoneNum.status = ContactDetailStatus.active;

    const createdContactDetailSecondPhoneNum = new ContactDetail();
    createdContactDetailSecondPhoneNum.contactDetailType =
      secondNumberIsWhatsApp === 'Yes'
        ? ContactDetailType.whatsapp
        : ContactDetailType.phone;
    createdContactDetailSecondPhoneNum.contactDetailValue =
      String(secondPhoneNumber);
    createdContactDetailSecondPhoneNum.status = ContactDetailStatus.active;

    createdContactDetailFirstPhoneNum.contact = tenantContact;
    createdContactDetailSecondPhoneNum.contact = tenantContact;

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
        case 'Swahili':
          return Language.Swahali;
        default:
          return '';
      }
    });

    return formattedLanguages as Language[];
  }
}
