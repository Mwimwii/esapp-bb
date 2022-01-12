import { AirtableBase } from 'airtable/lib/airtable_base';
import { EntityManager } from 'typeorm';
import {
    ContactDetailStatus,
    ContactDetailType,
    ContactType,
} from '@titl-all/shared/dist/enum';
import { mapGender } from '../../mappers/mapGender';
import { Contact, ContactDetail } from '../../models';
import { SanitizeNumber } from '../../utils/SanitizeNumber';
import { updateRelations } from './updateRelations';

// import tenants as contacts
export function importTenants(base: AirtableBase, manager: EntityManager) {

    const contactRepo = manager.getRepository(Contact);
    const contacts: Contact[] = [];

    console.log('Starting tenants..');

    try {
        base('Tenants').select({
            // Selecting the first 3 records in Grid view:
            // maxRecords: 2,
            view: 'Grid view',
        }).eachPage(function page(records, fetchNextPage) {
            // Get Existing tenants
            contactRepo.find({ select: ['airTableId'] }).then(items => {
                console.log(`${items.length} tenant airtableIds found.`);
                // This function (`page`) will get called for each page of records.
                records.forEach(function (record) {
                    if (!items.find(e => e.airTableId == record.get('TenantID'))) {
                        console.log(`Reading Tenant.. ${record.get('TenantID')}`);
                        const contact = <Contact><unknown>({
                          airTableId: record.get('TenantID'),
                          hubSpotId: record.get('HubspotPersonID'),
                          firstName: record.get('Firstname'),
                          lastName: record.get('Lastname'),
                          gender: mapGender(record.get('Gender')),
                          dob: record.get('DateOfBirth'),
                          contactDetails: [],
                          contactType: ContactType.tenant,
                          createdAt: record.get('RecordLastModifiedAt')
                        });

                        if (Number(record.get('Phone1'))) {
                            contact.contactDetails.push(<ContactDetail>({
                                contactDetailType: ContactDetailType.phone,
                                contactDetailValue: SanitizeNumber(record.get('Phone1')),
                                preferred: true,
                                status: SanitizeNumber(record.get('Phone1')).length > 9 ? ContactDetailStatus.erroneous : ContactDetailStatus.active
                            }));
                        } else {
                            if (record.get('Phone1')) {
                                const phonestr = record.get('Phone1');
                                (phonestr.replace(/[a-zA-Z() ]/g, '').replace('/', ',').split(',')).forEach((s: string) => {
                                    s = s.trim();
                                    if (Number(s) && SanitizeNumber(s).length == 9) {
                                        contact.contactDetails.push(<ContactDetail>({
                                            contactDetailType: ContactDetailType.phone,
                                            contactDetailValue: SanitizeNumber(s),
                                            preferred: true,
                                            status: ContactDetailStatus.active
                                        }));
                                    }
                                });
                            }
                        }

                        if (Number(record.get('Phone2'))) {
                            contact.contactDetails.push(<ContactDetail>({
                                contactDetailType: ContactDetailType.phone,
                                contactDetailValue: SanitizeNumber(record.get('Phone2')),
                                preferred: false,
                                status: SanitizeNumber(record.get('Phone2')).length > 9 ? ContactDetailStatus.erroneous : ContactDetailStatus.active
                            }));
                        }
                        else {
                            if (record.get('Phone2')) {
                                const phonestr = record.get('Phone2');
                                (phonestr!.replace(/[a-zA-Z() ]/g, '').replace('/', ',').split(',')).forEach((s: string) => {
                                    s = s.trim();
                                    if (Number(s) && SanitizeNumber(s).length == 9) {
                                        contact.contactDetails.push(<ContactDetail>({
                                            contactDetailType: ContactDetailType.phone,
                                            contactDetailValue: SanitizeNumber(s),
                                            preferred: false,
                                            status: ContactDetailStatus.active
                                        }));
                                    }
                                });
                            }
                        }
                        contacts.push(contact);
                    } else {
                        console.log(`Tenant in DB=> ${record.get('TenantID')}`);
                    }
                });

                console.log(`Saving Tenant ${contacts.length} `);
                contactRepo.save(contacts);
                console.log('Saved Tenants');
            });
            // To fetch the next page of records, call `fetchNextPage`.
            // If there are more records, `page` will get called again.
            // If there are no more records, `done` will get called.
            fetchNextPage();
        }, function done(err) {
            if (err) {
                console.error(err);
                return;
            }
            console.log('Completed Running ---> Tenants');
            updateRelations(manager);
        });
    } catch (error) {
        throw error;
    }
}

