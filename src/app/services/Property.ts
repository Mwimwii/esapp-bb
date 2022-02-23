/* eslint-disable arrow-parens */
import { OnboardingQuestions } from '@titl-all/shared/dist/types';
import {
  ConflictType,
  MeasurementType,
  PropertyStatus,
  PropertyType,
} from '@titl-all/shared/dist/enum';
import { Conflict, Property, User } from 'app/models';

export class PropertyService {
  async add(data: Partial<OnboardingQuestions>, user: User) {
    const {
      dimensionsOfLand: sizeSqf,
      metricUnits: sizeUnit,
      conflict,
      propertyType,
      conflictType,
      conflictComments,
    } = data;

    const createdConflict = new Conflict();
    createdConflict.conflictType = conflictType
      ? this.formatConflictTypes(String(conflictType).split(','))
      : [];
    createdConflict.confilctDescription = String(conflictComments);

    const createdProperty = new Property();

    createdProperty.conflicts = [];
    createdProperty.conflicts.push(createdConflict);

    createdProperty.sizeSqf = String(sizeSqf);
    if (sizeUnit) {
      createdProperty.sizeUnit = sizeUnit as MeasurementType;
    }
    createdProperty.inConflict = conflict === 'Yes';
    if (propertyType) {
      createdProperty.propertyType = propertyType as PropertyType;
    }
    // TODO confirm
    createdProperty.status = PropertyStatus.active;
    createdProperty.createdBy = user;

    await createdProperty.save();

    return createdProperty;
  }
  formatConflictTypes(coflictType?: string[]): ConflictType[] {
    const formattedConflictTypes = coflictType?.map((confType) => {
      switch (confType) {
        case 'Disputed ownership':
          return ConflictType.disputedOwnership;
        case 'Boundary disagreement':
          return ConflictType.boundaryDisagreement;
        case 'Inheritance':
          return ConflictType.inheritance;
        case 'Other':
          return ConflictType.other;

        default:
          return '';
      }
    });
    return formattedConflictTypes as ConflictType[];
  }
}
