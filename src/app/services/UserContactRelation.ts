import { getConnection, getManager } from 'typeorm';

import { User, Contact, ContactDetail } from 'app/models';
import { ContactDetailType } from '@titl-all/shared/dist/enum';

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
      .select(['contact.id', 'contact.firstName', 'contact.lastName'])
      .from(Contact, 'contact')
      .innerJoin('contact.contactDetails', 'contactDetail')
      .where('contactDetail.contactDetailType = :type', { type: ContactDetailType.phone })
      .andWhere('contactDetail.contactDetailValue = :value', { value: phoneNumber })
      .getOne();

    return contact;
  }

  /**
   * User Model From Phone Number
   * @desc query for a user model given a phone number and turn the results
   * into a user object
   * @see https://github.com/typeorm/typeorm/blob/master/docs/working-with-entity-manager.md
   * @see https://stackoverflow.com/questions/62130381/how-to-initialize-an-entity-passing-in-an-object-using-typeorm
   */
  async userAndContactModelFromPhoneNumber(phoneNumber: number): Promise<User|undefined>{
    const connection = getConnection();

    const userValues = await connection.createQueryBuilder()
      .from(User, 'users')
      .leftJoinAndSelect(Contact, 'contact', 'users.contactId = contact.id')
      .leftJoinAndSelect(ContactDetail, 'contactDetail', 'contactDetail.contactId = contact.id')
      .where('contactDetail.contactDetailType = :type', { type: ContactDetailType.phone })
      .andWhere('contactDetail.contactDetailValue = :value', { value: phoneNumber })
      .select([
        'users',
        'users.contactId as contact',
        'users.id',
        'users.email',
        'users.password',
        'contact.firstName as contact_first_name',
        'contact.lastName as contact_last_name',
      ])
      .getRawOne();

    // create a faux object with this raw data
    const manager = getManager();
    const user = manager.create(User, userValues);
    const contact = manager.create(Contact, {
      id: userValues.contact,
      firstName: userValues.contact_first_name,
      lastName: userValues.contact_last_name,
    });
    user.contact = contact;

    return user;
  }
}
