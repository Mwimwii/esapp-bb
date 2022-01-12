import { AirtableBase } from 'airtable/lib/airtable_base';
import { EntityManager } from 'typeorm';
import {
    ContactDetailStatus,
    ContactDetailType,
    PropertyType,
} from '@titl-all/shared/dist/enum';
import { Contact, ContactDetail, PropertyGroup } from '../../models';
import { getFromName } from '../../utils/getFromName';
import { SanitizeNumber } from '../../utils/SanitizeNumber';

// import LandGroups
export function importLandGroups(base: AirtableBase, manager: EntityManager) {
  const groupRepo = manager.getRepository(PropertyGroup);

  const groups: PropertyGroup[] = [];

  console.log('Staring LandGroups..');

  base('LandGroups').select({
    // Selecting the first 3 records in Grid view:
    // maxRecords: 2,
    view: 'Grid view',
  }).eachPage(function page(records, fetchNextPage) {
    // Get Existing LandRights
    groupRepo.find({ select: ['airTableId'] }).then(items => {
      console.log(`${items.length} landGroups airtableIds found.`);
      // This function (`page`) will get called for each page of records.
      records.forEach(function (record) {
        if (!items.find(e => e.airTableId == record.get('LandGroupID'))) {
          console.log(`Reading landOwner.. ${record.get('LandGroupID')}`);
          const group = <PropertyGroup>({
            airTableId: record.get('LandGroupID'),
            airTableParentId: record.get('LandownerID (from Landowner)') ? record?.get('LandownerID (from Landowner)')[0] : null,
            propertyType: PropertyType.mailo,
            nickname: record.get('LandGroupName'),
            country: record.get('Country'),
            region: record.get('Region'),
            district: record.get('District'),
            createdAt: record.get('RecordLastModifiedAt')
          });

          if (record.get('LC1Name')) {
            group.lC = <Contact><unknown>({
              firstName: getFromName(record.get('LC1Name'), 1),
              lastName: getFromName(record.get('LC1Name'), -1),
              contactDetails: []
            });
            if (record.get('LC1Phone')) {
              group.lC.contactDetails.push(<ContactDetail>({
                contactDetailType: ContactDetailType.phone,
                contactDetailValue: SanitizeNumber(record.get('LC1Phone')),
                preferred: true,
                status: SanitizeNumber(record.get('LC1Phone')).length > 9 ? ContactDetailStatus.erroneous : ContactDetailStatus.active
              }));
            }
          }

          groups.push(group);
        } else {
          console.log(`landGroup in DB=> ${record.get('LandGroupID')}`);
        }
      });
      console.log(`Saving Landgroups.. ${groups.length}`);
      groupRepo.save(groups);
      console.log('Saved LandGroup..');
    });
    // To fetch the next page of records, call `fetchNextPage`.
    // If there are more records, `page` will get called again.
    // If there are no more records, `done` will get called.
    fetchNextPage();
  }, function done(err) {
    if (err) { console.error(err); return; }
  });
}
