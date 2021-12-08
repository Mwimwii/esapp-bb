import path from "path";
import { File, Disk } from "@foal/storage";
import { dependency } from "@foal/core";

import { OnboardingQuestions } from "@titl-all/shared/dist/types";
import {
  Language,
  ContactType,
  ContactDetailType,
  ContactDetailStatus,
} from "@titl-all/shared/dist/enum";
import { User, Contact, ContactDetail } from "app/models";

export class TenantService {
  @dependency
  disk: Disk;

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

    if (contactType && contactType.length > 0) {
      // format this
      //tenantContact.contactType = contactType[0];
      tenantContact.contactType = "Tenant" as ContactType;
    }

    const phoneNumber = this.obtainNonWhatsAppPhoneNumber(
      String(firstPhoneNumber),
      String(firstNumberIsWhatsApp),
      String(secondPhoneNumber),
      String(secondNumberIsWhatsApp)
    );

    if (picture) {
      tenantContact.hasPicture = true;
      const directoryName = `0_${firstName}_${lastName}`;
      await this.disk.write(
        `attachments/contacts/${directoryName}`,
        picture.buffer,
        {
          name: `PROFILE_PORT_${firstName?.toUpperCase()}_${lastName?.toUpperCase()}_${phoneNumber}.${path.extname(
            String(picture.filename)
          )}`,
        }
      );
    }
    tenantContact.languages = Array.isArray(languages)
      ? this.formatLanguages(languages)
      : [];
    tenantContact.createdBy = user;

    const createdContactDetailFirstPhoneNum = new ContactDetail();
    createdContactDetailFirstPhoneNum.contactDetailType =
      firstNumberIsWhatsApp === "Yes"
        ? ContactDetailType.whatsapp
        : ContactDetailType.phone;
    createdContactDetailFirstPhoneNum.contactDetailValue =
      String(firstPhoneNumber);
    createdContactDetailFirstPhoneNum.status = ContactDetailStatus.active;

    const createdContactDetailSecondPhoneNum = new ContactDetail();
    createdContactDetailSecondPhoneNum.contactDetailType =
      secondNumberIsWhatsApp === "Yes"
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

  obtainNonWhatsAppPhoneNumber(
    firstNumber: string,
    firstIsWhatsApp: string,
    secondNumber: string,
    secondIsWhatsApp: string
  ) {
    if (firstIsWhatsApp === "No") {
      return firstNumber;
    }

    if (secondIsWhatsApp === "No") {
      return secondNumber;
    }

    return firstNumber;
  }

  formatLanguages(languages?: string[]): Language[] {
    const formattedLanguages = languages?.map((language) => {
      switch (language) {
        case "English":
          return Language.English;
        case "Luganda":
          return Language.Luganda;
        case "Swahali":
          return Language.Swahali;
        default:
          return "";
      }
    });

    return formattedLanguages as Language[];
  }
}
