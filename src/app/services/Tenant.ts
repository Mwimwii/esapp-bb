/* eslint-disable arrow-parens */
import { File } from '@foal/storage';

import { OnboardingQuestions } from '@titl-all/shared/dist/types';
import {
  Language,
  ContactType,
  ContactDetailStatus,
  ContactDetailType,
  HeardAboutUsType,
} from '@titl-all/shared/dist/enum';
import { User, Contact, ContactDetail } from 'app/models';

interface ContactDetailsInfo {
  phoneNumber: string;
  isWhatsApp: string;
}

export class TenantService {
  async add(data: Partial<OnboardingQuestions>, picture: File, user: User) {
    const {
      negotiationType,
      heardAboutUsType,
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
      whenRelationship,
      whereRelationship,
    } = data;

    const tenantContact = new Contact();

    tenantContact.negotiationType = String(negotiationType);
    tenantContact.heardAboutUsType = heardAboutUsType
      ? this.formatReferrals(String(heardAboutUsType).split(','))
      : [];
    tenantContact.firstName = String(firstName);
    tenantContact.lastName = String(lastName);
    tenantContact.nickName = String(nickname);
    tenantContact.gender = String(gender);
    tenantContact.dob = new Date(String(dateOfBirth));
    tenantContact.whenRelationship = String(whenRelationship);
    tenantContact.whereRelationship = String(whereRelationship);

    if (contactType) {
      // split(',')
      tenantContact.contactType = ContactType.tenant;
    }

    tenantContact.hasPicture = Boolean(picture);

    tenantContact.languages = languages
      ? this.formatLanguages(String(languages).split(','))
      : [];
    tenantContact.createdBy = user;

    const firstPhoneInfo: ContactDetailsInfo = {
      phoneNumber: String(firstPhoneNumber),
      isWhatsApp: String(firstNumberIsWhatsApp),
    };
    const secondPhoneInfo: ContactDetailsInfo = {
      phoneNumber: String(secondPhoneNumber),
      isWhatsApp: String(secondNumberIsWhatsApp),
    };

    await tenantContact.save();

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

    return tenantContact;
  }

  formatReferrals(heardAboutUsType?: string[]): HeardAboutUsType[] {
    const formattedReferrals = heardAboutUsType?.map((aboutUsType) => {
      switch (aboutUsType) {
        case 'Community Meeting':
          return HeardAboutUsType.communitymeeting;

        case 'Neighbors':
          return HeardAboutUsType.neighbors;

        case 'Leaflets':
          return HeardAboutUsType.leaflets;

        case 'TV':
          return HeardAboutUsType.tv;

        case 'LC1':
          return HeardAboutUsType.lc1;

        case 'Other':
          return HeardAboutUsType.other;

        default:
          return '';
      }
    });
    return formattedReferrals as HeardAboutUsType[];
  }

  formatLanguages(languages?: string[]): Language[] {
    const formattedLanguages = languages?.map((language) => {
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
