import { OnboardingQuestions } from '@titl-all/shared/dist/types';
import { MeasurementType } from '@titl-all/shared/dist/enum';
import { Property } from 'app/models';

export class PropertyService {
  add(data: Partial<OnboardingQuestions>) {
    const {
      dimensionsOfLand: sizeSqf,
      metricUnits: sizeUnit,
      conflict,
      //propertyUse: propertyType, // format this
    } = data;

    const createdProperty = new Property();

    createdProperty.sizeSqf = String(sizeSqf);
    createdProperty.sizeUnit = sizeUnit as MeasurementType;
    createdProperty.inConflict = conflict === 'Yes';
    // should be an array?
    //createdProperty.propertyType = propertyType;

    createdProperty.save();

    return createdProperty;
  }
}
