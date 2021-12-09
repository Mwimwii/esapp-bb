import path from 'path';
import { File, Disk } from '@foal/storage';
import { dependency } from '@foal/core';

import { OnboardingQuestions } from '@titl-all/shared/dist/types';
import { Language, ContactType, AssetType } from '@titl-all/shared/dist/enum';
import { FileService } from 'app/services';
import { User, Contact } from 'app/models';

export class TenantService {
  @dependency
  disk: Disk;

  @dependency
  fileService: FileService;

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

    const phoneNumber = this.obtainNonWhatsAppPhoneNumber(
      String(firstPhoneNumber),
      String(firstNumberIsWhatsApp),
      String(secondPhoneNumber),
      String(secondNumberIsWhatsApp),
    );

    tenantContact.hasPicture = Boolean(picture);

    tenantContact.languages = languages ? this.formatLanguages(String(languages).split(',')) : [];
    tenantContact.createdBy = user;

    tenantContact.save();

    if (picture) {
      const pictureName = `PROFILE_PORT_${firstName?.toUpperCase()}_${lastName?.toUpperCase()}_${phoneNumber}${path.extname(String(picture.filename))}`;
      const directoryName = `0_${firstName}_${lastName}`;
      const assetPath = `attachments/contacts/${directoryName}`;

      this.fileService.saveAsset(picture, AssetType.profile ,pictureName, assetPath, tenantContact, user);
    }

    return tenantContact;
  }

  obtainNonWhatsAppPhoneNumber(
    firstNumber: string,
    firstIsWhatsApp: string,
    secondNumber: string,
    secondIsWhatsApp: string) {
      if (firstIsWhatsApp === 'No') {
        return firstNumber;
      }

      if (secondIsWhatsApp === 'No') {
        return secondNumber;
      }

      return firstNumber;
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
