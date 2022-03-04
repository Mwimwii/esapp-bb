import { AirtableBase } from 'airtable/lib/airtable_base';
import { EntityManager } from 'typeorm';
import {
  PaymentCurrency,
  PaymentPlanStatus,
  PaymentType,
  PropertyStatus,
  PaymentCycle,
} from '@titl-all/shared/dist/enum';
import { mapAgreementStatus } from '../../mappers/mapAgreementStatus';
import { mapAgreementType } from '../../mappers/mapAgreementType';
import { Property, Agreement, PaymentPlan, Comment } from '../../models';
import { mapPaymentPlanStatus } from '../../mappers/mapPaymentPlanStatus';
import { mapXLPaymentType } from '../Excel/mapXLPaymentType';
import { mapPaymentCylce } from '../../utils/mapPaymentCylce';
import { mapPropertyType } from "../../mappers/mapPropertyType";

// import LandRights
export function importLandRights(base: AirtableBase, manager: EntityManager) {
  const propertyRepo = manager.getRepository(Property);

  console.log('starting landRight..');

  // try {
  base('LandRights').select({
    // Selecting the first 3 records in Grid view:
    // maxRecords: 2,
    view: 'Importer',
  }).eachPage(function page(records, fetchNextPage) {
    // Get Existing LandRights
    propertyRepo.find({ select: ['airTableId'] }).then(items => {
      console.log(`${items.length} property airtableIds found.`);
      // This function (`page`) will get called for each page of records.
      records.filter(r => (r.get('Tenant')) ? true : false)
        .forEach(function (record) {
          if (!items.find(e => e.airTableId == record.get('LandRightID'))) {
            console.log(`Reading landRight.. ${record.get('LandRightID')}`);
            const property = ({
              hubSpotId: record.get('HubspotPersonID'),
              airTableId: record.get('LandRightID'),
              airTableParentId: record.get('LandGroup') ? (record.get('LandGroup') as string[])[0] : null,
              sizeSqf: record.get('LandSize(sqf)') || 0,
              propertyType: mapPropertyType(String(record.get('LandCategory'))),
              nickname: record.get('referenceID'),
              status: PropertyStatus.active,
              agreements: [
                ({
                  hubSpotId: record.get('HubspotPersonID'),
                  airTableId: record.get('LandRightID'),
                  airTableTenantId: (record.get('Tenant') as string[])[0],
                  status: mapAgreementStatus((record.get('TenantOnboardingStage (from Tenant)') as string[])[0]),
                  dateArrived: record.get('DateArrived (from Tenant)'),
                  requestedAgreementType: [mapAgreementType(record.get('OrigRequestedNegotiation') as string)],
                  agreementType: mapAgreementType(record.get('OrigRequestedNegotiation') as string),
                  coOwnership: record.get('CoOwnership'),
                  paymentPlans: [],
                  comments: [],
                  createdAt: record.get('RecordLastModifiedAt')
                } as unknown) as Agreement
              ],
              createdAt: record.get('RecordLastModifiedAt')
            } as unknown) as Property;

            if (record.get('PaymentSize')) {
              property.agreements[0].paymentPlans.push(
                ({
                  airTableId: record.get('LandRightID'),
                  hubSpotId: record.get('HubspotPersonID'),
                  paymentType: mapXLPaymentType(record.get('PaymentType')),
                  baseAmount: parseInt(record.get('PaymentSize') as string) || 0,
                  agreedAmount: parseInt(record.get('PaymentSize') as string) || 0,
                  outstandingAmount: parseInt(record.get('PaymentSize') as string) || 0,
                  currency: PaymentCurrency.ugx,
                  cycle: mapPaymentCylce(record.get('PaymentFreq') as string),
                  paidUpUntil: record.get('OrigPaidUpUntil'),
                  createdAt: record.get('RecordLastModifiedAt'),
                  status: PaymentPlanStatus.active
                } as unknown) as PaymentPlan
              );
            }

            if (record.get('OrigOverdueKanzu')) {
              property.agreements[0].paymentPlans.push(
                ({
                  airTableId: record.get('LandRightID'),
                  hubSpotId: record.get('HubspotPersonID'),
                  paymentType: PaymentType.kanzu,
                  baseAmount: parseInt(record.get('OrigKanzu') as string) || 0,
                  agreedAmount: parseInt(record.get('OrigKanzu') as string) || 0,
                  outstandingAmount: parseInt(record.get('OrigOverdueKanzu') as string) || 0,
                  currency: PaymentCurrency.ugx,
                  cycle: PaymentCycle.oneoff,
                  paidUpUntil: record.get('OrigPaidUpUntil'),
                  createdAt: record.get('RecordLastModifiedAt'),
                  status: mapPaymentPlanStatus(record.get('KanzuStatus') as string)
                } as unknown) as PaymentPlan
              );
            }

            if (record.get('RenegotiatedArrearsDue')) {
              property.agreements[0].paymentPlans.push(
                ({
                  airTableId: record.get('LandRightID'),
                  hubSpotId: record.get('HubspotPersonID'),
                  paymentType: PaymentType.arrears,
                  baseAmount: parseInt(record.get('RenegotiatedArrearsDue') as string) || 0,
                  agreedAmount: parseInt(record.get('RenegotiatedArrearsDue') as string) || 0,
                  outstandingAmount: parseInt(record.get('RenegotiatedArrearsDue') as string) || 0,
                  currency: PaymentCurrency.ugx,
                  cycle: PaymentCycle.oneoff,
                  dueDate: record.get('RenegotiatedArrearsDueDate'),
                  createdAt: record.get('RecordLastModifiedAt'),
                  status: PaymentPlanStatus.active
                } as unknown) as PaymentPlan
              );
            }

            if (record.get('Notes')) {
              property.agreements[0].comments.push({
                comment: record.get('Notes'),
                createdAt: record.get('RecordLastModifiedAt'),
                modifiedAt: record.get('RecordLastModifiedAt')
              } as Comment)
            }

            propertyRepo.findOne({ where: { airTableId: property.airTableId } }).then(prop => {
              if (!prop) {
                propertyRepo.save(property);
                console.log(`LandRight Saving <= ${property.airTableId}`);
              }
            });
          } else {
            console.log(`LandRight in DB => ${record.get('LandRightID')}`);
          }
        });
    });
    // To fetch the next page of records, call `fetchNextPage`.
    // If there are more records, `page` will get called again.
    // If there are no more records, `done` will get called.

    fetchNextPage();
  }, function done(err) {
    if (err) { console.error(err); return; }
  });
  // } catch (error) {
  //     throw error;
  // }
}
