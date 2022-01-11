import { MeasurementType } from '@titl-all/shared/dist/enum';

export function mapSizeUnit(unit: any): MeasurementType {
    switch (unit) {
        case 'acre':
            return MeasurementType.acre;
        case 'feet':
            return MeasurementType.sqft;
        default:
            return MeasurementType.sqmt;
    }
}
