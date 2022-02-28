import { AssetType } from '@titl-all/shared/dist/enum';

export function mapAssetType(value: string): AssetType {
  switch (value?.toLowerCase()) {
    case "nin":
    case "identification":
    case "id":
      return AssetType.nationalId;
    case "identification":
      return AssetType.driversLicense;
    case "villageId":
      return AssetType.villageId;
    case "passport":
      return AssetType.passport;
    case "agreement":
      return AssetType.agreement;
    case "consent":
      return AssetType.consent;
    case "receipt":
    case "receipts":
      return AssetType.receipt;
    case "notes":
      return AssetType.notes;
    case "map":
      return AssetType.map;
    case "letter":
      return AssetType.letter;
    case "title":
      return AssetType.title;
    case "profile":
    case "port":
      return AssetType.profile;
    default:
      return AssetType.other;
  }
}
