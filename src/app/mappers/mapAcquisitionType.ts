import { AcquisitionType } from '@titl-all/shared/dist/enum';

export function mapAcquisitionType(key: any): AcquisitionType {
    switch (key) {
        case 'purchased':
            return AcquisitionType.purchased;
        case 'inherited':
            return AcquisitionType.inherited;
        case 'transferred':
            return AcquisitionType.transferred;
        case 'occupied':
            return AcquisitionType.occupied;
        case 'changedtype':
            return AcquisitionType.occupied;
        default:
            return AcquisitionType.unknown;
    }
}
