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

  const contactDetail = await ContactDetail.findOne({
    relations: ['contact'],
    where: [
      { contactDetailValue: SanitizeNumber(readJotFormValue(record, 177, 1)) },
      { contactDetailValue: SanitizeNumber(readJotFormValue(record, 177, 8)) }
    ]
  });

  if (contactDetail) {
    console.log(contactDetail);
    if (contactDetail?.contact.firstName.toLowerCase() == readJotFormValue(record, 94, 'first').toLowerCase() ||
      contactDetail?.contact.lastName.toLowerCase() == readJotFormValue(record, 94, 'last').toLowerCase()) {
      return contactDetail?.contact;
    };
  }

  let contact = await repository.findOne({ where: [{ firstName: readJotFormValue(record, 94, 'first'), lastName: readJotFormValue(record, 94, 'last') }, { jotFormId: record.id }] });

  if (!contact) {
    contact = ({
      jotFormId: record.id,
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

