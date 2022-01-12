import { Contact, ContactDetail } from '../../models';
import { SanitizeNumber } from '../../utils/SanitizeNumber';
import { Repository } from 'typeorm';
import { ContactType } from '@titl-all/shared/dist/enum';
import { readJotFormDate } from '../../utils/jotform/readJotFormDate';
import { mapJotformGender } from '../../mappers/mapJotformGender';
import { mapJotFormLanguage } from '../../mappers/mapJotFormLanguage';
import { readJotFormValue } from '../../utils/jotform/readJotFormValue';
import { mapJotformContactDetailPhoneType } from '../../mappers/mapJotformContactDetailPhoneType';

export async function getJotformTenant(record: any, repository: Repository<Contact>): Promise<Contact> {
  let contact = await repository.findOne({ where: [{ firstName: readJotFormValue(record, 94, 'first'), lastName: readJotFormValue(record, 94, 'last'), dob: readJotFormDate(record, 165) }] });

  if (!contact) {
    contact = ({
      firstName: readJotFormValue(record, 94, 'first'),
      lastName: readJotFormValue(record, 94, 'last'),
      nickName: readJotFormValue(record, 183, null),
      gender: mapJotformGender(readJotFormValue(record, 97, null)),
      contactType: ContactType.tenant,
      languages: mapJotFormLanguage(readJotFormValue(record, 101, null)),
      dob: readJotFormDate(record, 165),
      contactDetails: []
    } as unknown) as Contact;

    if (readJotFormValue(record, 177, 1)) {
      contact.contactDetails.push({
        contactDetailType: mapJotformContactDetailPhoneType(readJotFormValue(record, 177, 2)),
        preferred: true,
        contactDetailValue: SanitizeNumber(readJotFormValue(record, 177, 1))
      } as ContactDetail);
    }

    if (readJotFormValue(record, 177, 8)) {
      contact.contactDetails.push({
        contactDetailType: mapJotformContactDetailPhoneType(readJotFormValue(record, 177, 5)),
        preferred: true,
        contactDetailValue: SanitizeNumber(readJotFormValue(record, 177, 8))
      } as ContactDetail);
    }

    await repository.save(contact);
  }

  return contact;
}

