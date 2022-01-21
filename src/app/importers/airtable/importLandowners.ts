import { AirtableBase } from 'airtable/lib/airtable_base';
import { EntityManager } from 'typeorm';
import { ContactDetailStatus, ContactDetailType, ContactType } from '@titl-all/shared/dist/enum';
import { mapGender } from '../../mappers/mapGender';
import { Contact, ContactDetail } from '../../models';
import { SanitizeNumber } from '../../utils/SanitizeNumber';

// imports LandOwners
export function importLandowners(base: AirtableBase, manager: EntityManager) {
    const contactRepo = manager.getRepository(Contact);

    const contacts: Contact[] = [];

    console.log('Starting LandOnwers...');

    base('Landowners').select({
        // Selecting the first 3 records in Grid view:
        // maxRecords: 2,
        view: 'Grid view',
    }).eachPage((records, fetchNextPage) => {
        // Get Existing LandRights
        contactRepo.find({ select: ['airTableId'] }).then(items => {
            console.log(`${items.length} landOwner airtableIds found.`);
            // This function (`page`) will get called for each page of records.
            records.forEach(function (record) {
                if (!items.find(e => e.airTableId == record.get('LandownerID'))) {
                    console.log(`Reading landOwner.. ${record.get('LandownerID')}`);
                    const contact = ({
                      airTableId: record.get('LandownerID'),
                      firstName: record.get('Firstname'),
                      lastName: record.get('Lastname'),
                      gender: mapGender(record.get('Gender')),
                      dob: record.get('DateOfBirth'),
                      contactDetails: [],
                      contactType: ContactType.owner,
                      createdAt: record.get('RecordLastModifiedAt')
                    } as unknown) as Contact;
                    if (record.get('Phone')) {
                        contact.contactDetails.push({
                            contactDetailType: ContactDetailType.phone,
                            contactDetailValue: SanitizeNumber(record.get('Phone')),
                            preferred: true,
                            status: SanitizeNumber(record.get('Phone')).length > 9 ? ContactDetailStatus.erroneous : ContactDetailStatus.active
                        } as ContactDetail);
                    }
                    if (record.get('Email')) {
                        contact.contactDetails.push({
                            contactDetailType: ContactDetailType.email,
                            contactDetailValue: record.get('Email'),
                            preferred: true,
                            status: ContactDetailStatus.active
                        } as ContactDetail);
                    }
                    console.debug(contact);
                    contacts.push(contact);
                } else {
                    console.log(`LandOwner in DB=> ${record.get('LandownerID')}`);
                }
            });
            console.log(`Saving LandOwners.. ${contacts.length}`);
            contactRepo.save(contacts);
            console.log('Saved LandOwners..');
        });
        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        fetchNextPage();
    }, function done(err) {
        if (err) { console.error(err); return; }
    });
}
