import { Contact, ContactDetail } from '../../models';
import {
  ContactDetailType,
  ContactType,
} from '@titl-all/shared/dist/enum';
import { SanitizeNumber } from '../../utils/SanitizeNumber';
import { Repository } from 'typeorm';
import { readJotFormValue } from '../../utils/jotform/readJotFormValue';

export async function getJotformLC(record: any, repository: Repository<Contact>): Promise<Contact> {

  let contact = await repository.findOne({ where: [{ firstName: readJotFormValue(record, 190, 1), lastName: readJotFormValue(record, 190, 2) }] });

  if (!contact) {
    contact = ({
      firstName: readJotFormValue(record, 190, 1),
      lastName: readJotFormValue(record, 190, 2),
      contactType: ContactType.govtrepresentative,
      contactDetails: []
    } as unknown) as Contact;
    if (SanitizeNumber(readJotFormValue(record, 190, 3))) {
      contact.contactDetails.push(
        {
          contactDetailType: ContactDetailType.phone,
          preferred: true,
          contactDetailValue: SanitizeNumber(readJotFormValue(record, 190, 3))
        } as ContactDetail
      );
    }
    await repository.save(contact);
  }

  return contact;
}
