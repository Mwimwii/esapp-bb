import { PropertyType } from '@titl-all/shared/dist/enum';


export function mapPropertyType(landCategory: string): PropertyType {
  switch (landCategory.trim()) {
    case 'tenant':
      return PropertyType.mailo;
    case 'Rental tenant':
      return PropertyType.commercial;
    default:
      return PropertyType.residential;
  }
}
