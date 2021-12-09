import { OnboardingQuestions } from '@titl-all/shared/dist/types';
import { MeasurementType, PropertyStatus } from '@titl-all/shared/dist/enum';
import { Property, User } from 'app/models';

export class PropertyService {
  async add(data: Partial<OnboardingQuestions>, user: User) {
    const {
      dimensionsOfLand: sizeSqf,
      metricUnits: sizeUnit,
      conflict,
    } = data;

    const createdProperty = new Property();

    createdProperty.sizeSqf = String(sizeSqf);
    if (sizeUnit) {
      createdProperty.sizeUnit = sizeUnit as MeasurementType;
    }
    createdProperty.inConflict = conflict === 'Yes';
    // TODO confirm
    createdProperty.status = PropertyStatus.active;
    createdProperty.createdBy = user;

    await createdProperty.save();

    return createdProperty;
  }
}
