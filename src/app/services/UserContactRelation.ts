import { getConnection } from 'typeorm';

import { User, Contact, ContactDetail } from 'app/models';
import { ContactDetailType } from 'app/enums/ContactDetailType';

interface UserAndContact {
  contactid?: number;
  userpassword?: string;
  userid?: number;
}

export class UserContactRelationService {
  async detailsFromPhoneNumber(phoneNumber: number): Promise<UserAndContact> {
    const connection = getConnection();
    const result = await connection.createQueryBuilder()
    .select([
      'contact.id as contactid',
      'users.password as userpassword',
      'users.id as userid'
    ])
    .from(Contact, 'contact')
    .innerJoin('contact.contactDetails', 'contactDetail')
    .leftJoinAndSelect(User, 'users', 'users.contactId = contact.id')
    .where('contactDetail.contactDetailType = :type', { type: ContactDetailType.phone })
    .andWhere('contactDetail.contactDetailValue = :value', { value: phoneNumber })
    .getRawOne();

    if (!result) {
      return { contactid: undefined, userpassword: undefined, userid: undefined }
    }

    return result;
  }

  async contactModelFromPhoneNumber(phoneNumber: number): Promise<Contact|undefined> {
    const connection = getConnection();

    const contact = await connection.createQueryBuilder()
    .select('contact.id')
    .from(Contact, 'contact')
    .innerJoin('contact.contactDetails', 'contactDetail')
    .where('contactDetail.contactDetailType = :type', { type: ContactDetailType.phone })
    .andWhere('contactDetail.contactDetailValue = :value', { value: phoneNumber })
    .getOne();

    return contact;
  }

  async userModelFromPhoneNumber(phoneNumber: number): Promise<User|undefined>{
    const connection = getConnection();

    const user = await connection.createQueryBuilder()
    .select('users')
    .from(User, 'users')
    .leftJoinAndSelect(Contact, 'contact', 'users.contactId = contact.id')
    .leftJoinAndSelect(ContactDetail, 'contactDetail', 'contactDetail.contactId = contact.id')
    .where('contactDetail.contactDetailType = :type', { type: ContactDetailType.phone })
    .andWhere('contactDetail.contactDetailValue = :value', { value: phoneNumber })
    .getOne();

    return user;
  }
}
