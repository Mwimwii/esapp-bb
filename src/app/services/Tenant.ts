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

    tenantContact.languages = languages
      ? this.formatLanguages(String(languages).split(','))
      : [];
    tenantContact.createdBy = user;

    interface ContactDetailsInfo {
      phoneNumber: string;
      isWhatsApp: string;
    }
    const firstPhoneInfo: ContactDetailsInfo = {
      phoneNumber: String(firstPhoneNumber),
      isWhatsApp: String(firstNumberIsWhatsApp),
    };
    const secondPhoneInfo: ContactDetailsInfo = {
      phoneNumber: String(secondPhoneNumber),
      isWhatsApp: String(secondNumberIsWhatsApp),
    };
    [firstPhoneInfo, secondPhoneInfo].map(
      async (details: ContactDetailsInfo) => {
        const createdContactDetail = new ContactDetail();
        createdContactDetail.contactDetailType =
          details.isWhatsApp === 'Yes'
            ? ContactDetailType.whatsapp
            : ContactDetailType.phone;
        createdContactDetail.contactDetailValue = details.phoneNumber;
        createdContactDetail.status = ContactDetailStatus.active;
        createdContactDetail.contact = tenantContact;
        await createdContactDetail.save();
      }
    );

    tenantContact.save();

    return tenantContact;
  }

  formatLanguages(languages?: string[]): Language[] {
    const formattedLanguages = languages?.map(language => {
      switch (language) {
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
