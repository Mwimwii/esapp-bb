import {
  Agreement,
  Comment,
  Conflict,
  Contact,
  Property,
  PropertyGroup,
} from '../../models';
import { EntityManager, IsNull, Not } from 'typeorm';
import {
  PropertyType,
  PropertyStatus,
  AgreementStatus,
} from '@titl-all/shared/dist/enum';
import { mapAcquisitionType } from '../../mappers/mapAcquisitionType';
import { readJotFormDate } from '../../utils/jotform/readJotFormDate';
import { mapAgreementType } from '../../mappers/mapAgreementType';
import { mapSizeUnit } from '../../mappers/mapSizeUnit';
import { readJotFormValue } from '../../utils/jotform/readJotFormValue';
import { getJotformLC } from './getJotformLC';
import { getJotformTenant } from './getJotformTenant';
import { getNamedRelations } from './getNamedRelations';
import { readProposedGroundRentPaymentPlan } from './readProposedGroundRentPaymentPlan';
import { readProposedBuyOutPlan } from './readProposedBuyOutPlan';
import { readOldGroundRentPaymentPlan } from './readOldGroundRentPaymentPlan';
import { readProposedKanzuPaymentPlan } from './readProposedKanzuPaymentPlan';
import { readOldKanzuPaymentPlan } from './readOldKanzuPaymentPlan';
import { Disk } from '@foal/storage';

export function readJotformSubmissions(
  jf: any,
  manager: EntityManager,
  disk: Disk,
  id: any
) {
  const propertyGroupRepo = manager.getRepository(PropertyGroup);
  const propertyRepo = manager.getRepository(Property);

  jf.getFormSubmissions(id, {
    offset: 0,
    limit: 1000,
    filter: {
      status: 'ACTIVE',
      // "id": "5111331809412373928",
      // "updated_at:lt": "2013"
    },
    orderby: 'created_at',
    direction: 'ASC',
  })
    .then(async (records: any) => {
      const nickname = `${readJotFormValue(
        records[0],
        140,
        2
      )}_${readJotFormValue(records[0], 140, 3)}_${readJotFormValue(
        records[0],
        140,
        4
      )}`;

      let propertyGroup = await propertyGroupRepo.findOne({
        where: [{ nickname: nickname }],
      });
      if (!propertyGroup) {
        propertyGroup = {
          nickname: nickname,
          propertyType: PropertyType.mailo,
          lC: await getJotformLC(records[0], manager.getRepository(Contact)),
        } as PropertyGroup;
        propertyGroupRepo.save(propertyGroup);
      }

      console.log(propertyGroup);

      const savedIds = await propertyRepo.find({
        select: ['jotFormId'],
        where: { jotFormId: Not(IsNull()) },
      });

      records.forEach(async (record: any) => {
        if (!savedIds.find(p => p.jotFormId == record.id)) {

          const tenant = await getJotformTenant(
            record,
            manager.getRepository(Contact)
          );

          const agreement = await Agreement.createQueryBuilder('agreement')
            .leftJoinAndSelect("agreement.property", "property")
            .leftJoinAndSelect("agreement.owner", "owner")
            .leftJoinAndSelect("agreement.tenant", "tenant")
            .leftJoinAndSelect("agreement.paymentPlans", "paymentPlans")
            .where('agreement.tenantId = :tenantId', { tenantId: tenant.id })
            .getOne();

          if (agreement) {
            console.log(agreement);
            return;
          }

          try {
            const property = ({
              jotFormId: record.id,
              propertyGroup: propertyGroup,
              propertyType: propertyGroup!.propertyType,
              parish: readJotFormValue(record, 140, 1),
              village: readJotFormValue(record, 140, 2),
              blockNo: readJotFormValue(record, 140, 3),
              plotNo: readJotFormValue(record, 140, 4),
              sizeSqf: readJotFormValue(record, 179, 1),
              geospatial: readJotFormValue(record, 210, null),
              sizeUnit: mapSizeUnit(readJotFormValue(record, 179, 2)),
              nickname: readJotFormValue(record, 183, null),
              lC: propertyGroup!.lC,
              conflicts: [],
              agreements: [],
              status: PropertyStatus.active,
            } as unknown) as Property;

            const agreement = ({
              jotFormId: record.id,
              requestedAgreementType: readJotFormValue(record, 28, null)
                ? [mapAgreementType(readJotFormValue(record, 28, null)[0])]
                : null,
              otherAgreementTypes: readJotFormValue(record, 28, null),
              agreementType: mapAgreementType(
                readJotFormValue(record, 144, null)
              ),
              acquisitionType: mapAcquisitionType(
                readJotFormValue(record, 170, null)
              ),
              propertUseType: readJotFormValue(record, 143, null),
              status: AgreementStatus.identified,
              tenant: tenant,
              namedNeighbors: getNamedRelations(
                readJotFormValue(record, 172, null)
              ),
              namedVerifiers: getNamedRelations(
                readJotFormValue(record, 173, null)
              ),
              negotiationType: readJotFormValue(record, 208, null),
              heardAboutUs: readJotFormValue(record, 209, null),
              employeeName: readJotFormValue(record, 200, null),
              paymentPlans: [],
              comments: [],
            } as unknown) as Agreement;

            if (readJotFormValue(record, 204, null)) {
              console.log(`comment ${readJotFormValue(record, 204, null)}`);
              agreement.comments.push({
                comment: readJotFormValue(record, 204, null),
                createdAt: record.updated_at || record.created_at,
              } as Comment);
            }

            if (readJotFormDate(record, 166)) {
              agreement.dateArrived = readJotFormDate(record, 166);
            }

            // Read Kanzu
            agreement.paymentPlans.push(
              readOldKanzuPaymentPlan(record, agreement)
            );

            // Read proposedKanzu
            agreement.paymentPlans.push(
              readProposedKanzuPaymentPlan(record, agreement)
            );

            // Read Old Busulu
            agreement.paymentPlans.push(
              readOldGroundRentPaymentPlan(record, agreement)
            );

            // Read New Busulu
            agreement.paymentPlans.push(
              readProposedGroundRentPaymentPlan(record, agreement)
            );

            // Read Buyout Plan
            agreement.paymentPlans.push(
              readProposedBuyOutPlan(record, agreement)
            );

            property.agreements.push(agreement);

            if (readJotFormValue(record, 145, null) === 'YES') {
              property.conflicts.push({
                conflictType: readJotFormValue(record, 202, null),
                confilctDescription: readJotFormValue(record, 203, null),
              } as Conflict);
              property.status = PropertyStatus.conflicted;
            }

            if (disk) {
              // // Upload identification images
              // processJotformFiles(
              //   record,
              //   136,
              //   AssetType.nationalId,
              //   SourceType.identification,
              //   property,
              //   disk
              // );

              // //Upload profile images
              // processJotformFiles(
              //   manager,
              //   record,
              //   139,
              //   AttachmentType.profile,
              //   SourceType.identification,
              //   property,
              //   s3Client
              // );

              // //Upload agreement files
              // processJotformFiles(
              //   manager,
              //   record,
              //   138,
              //   AttachmentType.agreement,
              //   SourceType.agreement,
              //   property,
              //   s3Client
              // );

              // //Upload agreement files
              // processJotformFiles(
              //   manager,
              //   record,
              //   174,
              //   AttachmentType.consent,
              //   SourceType.agreement,
              //   property,
              //   s3Client
              // );

              // //Upload Kanzu Receipts
              // processJotformFiles(
              //   manager,
              //   record,
              //   121,
              //   AttachmentType.reciept,
              //   SourceType.payment,
              //   property,
              //   s3Client
              // );

              // //Upload Busuulu Receipts
              // processJotformFiles(
              //   manager,
              //   record,
              //   148,
              //   AttachmentType.reciept,
              //   SourceType.payment,
              //   property,
              //   s3Client
              // );
            }

            // console.debug(property);
            // propertyRepo.save(property);
          } catch (error) {
            console.debug(error);
          }
        }
      });
      console.log('Import Complete');
    })
    .fail(function (e: any) {
      console.log({ id, e });
    });
}
