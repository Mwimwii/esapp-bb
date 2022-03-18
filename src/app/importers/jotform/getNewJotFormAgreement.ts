import {
  Agreement,
  Comment,
  Conflict,
  Contact,
  Property,
  PropertyGroup
} from '../../models';
import {
  PropertyStatus,
  AgreementStatus
} from '@titl-all/shared/dist/enum';
import { mapAcquisitionType } from '../../mappers/mapAcquisitionType';
import { readJotFormDate } from '../../utils/jotform/readJotFormDate';
import { mapAgreementType } from '../../mappers/mapAgreementType';
import { mapSizeUnit } from '../../mappers/mapSizeUnit';
import { readJotFormValue } from '../../utils/jotform/readJotFormValue';
import { getNamedRelations } from './getNamedRelations';
import { readProposedGroundRentPaymentPlan } from './readProposedGroundRentPaymentPlan';
import { readProposedBuyOutPlan } from './readProposedBuyOutPlan';
import { readOldGroundRentPaymentPlan } from './readOldGroundRentPaymentPlan';
import { readProposedKanzuPaymentPlan } from './readProposedKanzuPaymentPlan';
import { readOldKanzuPaymentPlan } from './readOldKanzuPaymentPlan';

export function getNewJotFormAgreement(record: any, propertyGroup: PropertyGroup | undefined, tenant: Contact): Agreement {
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

  if (readJotFormValue(record, 145, null) === 'YES') {
    property.conflicts.push({
      conflictType: readJotFormValue(record, 202, null),
      confilctDescription: readJotFormValue(record, 203, null),
    } as Conflict);
    property.status = PropertyStatus.conflicted;
  }

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
    propertyUseType: readJotFormValue(record, 143, null),
    status: AgreementStatus.negperformed,
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
    property: property
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


  agreement.paymentPlans.push(
    readOldKanzuPaymentPlan(record, agreement),
    readProposedKanzuPaymentPlan(record, agreement),
    readOldGroundRentPaymentPlan(record, agreement),
    readProposedGroundRentPaymentPlan(record, agreement),
    readProposedBuyOutPlan(record, agreement) // Read Buyout Plan
  );

  return agreement;
}
