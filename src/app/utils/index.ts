import { AssetType } from '@titl-all/shared/dist/enum';

export const obtainNonWhatsAppPhoneNumber = (
  firstNumber: string,
  firstIsWhatsApp: string,
  secondNumber: string,
  secondIsWhatsApp: string) => {
    if (firstIsWhatsApp === 'No') {
      return firstNumber;
    }

    if (secondIsWhatsApp === 'No') {
      return secondNumber;
    }

    return firstNumber;
  }

export const getCodesForIdentification =
  (type: string): { shortCode: string; assetType: AssetType } => {
    switch(type) {
      case 'National Id':
        return { shortCode: 'NIN', assetType: AssetType.nationalId };
      case 'Driver\'s License':
        return { shortCode: 'DRV', assetType: AssetType.driversLicense };
      case 'Passport':
        return { shortCode: 'PAS', assetType: AssetType.passport };
      // TODO update documentation https://github.com/titl-all/data-importer/blob/main/AWS_Image_Cleanup.md
      case 'Village Id':
        return { shortCode: 'VID', assetType: AssetType.villageId };
    }

    return { shortCode: 'OTH', assetType: AssetType.other };
  }

