import {
  Agreement
} from '../../models';

export function updateExistingAgreement(existingAgreement: Agreement, newAgreement: Agreement): Agreement {

  existingAgreement.jotFormId = newAgreement.jotFormId;
  existingAgreement.property.propertyGroup = newAgreement.property.propertyGroup;
  existingAgreement.property.propertyType = newAgreement.property.propertyType;
  existingAgreement.property.parish = newAgreement.property.parish;
  existingAgreement.property.village = newAgreement.property.village;
  existingAgreement.property.blockNo = newAgreement.property.blockNo;
  existingAgreement.property.plotNo = newAgreement.property.plotNo;
  existingAgreement.property.sizeSqf = newAgreement.property.sizeSqf;
  existingAgreement.property.geospatial = newAgreement.property.geospatial;
  existingAgreement.property.sizeUnit = newAgreement.property.sizeUnit;
  existingAgreement.property.nickname = newAgreement.property.nickname;
  existingAgreement.property.lC = newAgreement.property.lC;
  existingAgreement.property.conflicts = newAgreement.property.conflicts
  existingAgreement.property.status = newAgreement.property.status;

  existingAgreement.jotFormId = newAgreement.jotFormId;
  existingAgreement.requestedAgreementType = newAgreement.requestedAgreementType;
  existingAgreement.otherAgreementTypes = newAgreement.otherAgreementTypes;
  existingAgreement.agreementType = newAgreement.agreementType;
  existingAgreement.acquisitionType = newAgreement.acquisitionType;
  existingAgreement.propertyUseType = newAgreement.propertyUseType;
  existingAgreement.status = newAgreement.status;
  existingAgreement.tenant = newAgreement.tenant;
  existingAgreement.namedNeighbors = newAgreement.namedNeighbors;
  existingAgreement.namedVerifiers = newAgreement.namedVerifiers;
  existingAgreement.negotiationType = newAgreement.negotiationType;
  existingAgreement.heardAboutUs = newAgreement.heardAboutUs;
  existingAgreement.employeeName = newAgreement.employeeName;
  existingAgreement.comments = newAgreement.comments;
  existingAgreement.dateArrived = newAgreement.dateArrived;
  existingAgreement.paymentPlans = newAgreement.paymentPlans;

  return existingAgreement;
}
