import { Property } from '../../models';
import { readJotFormValue } from '../../utils/jotform/readJotFormValue';
import {
  AssetType,
  SourceType,
} from '@titl-all/shared/dist/enum';
import { uploadJotFormFiles } from './uploadJotFormFiles';
import { replaceNonAlphaNumerics } from '../../utils/replaceNonAlphaNumerics';
import { Disk } from '@foal/storage';

export function processJotformFiles(record: any, field: number, attachmentType: AssetType, sourceType: SourceType, property: Property, s3Client: Disk) {
  if (readJotFormValue(record, field, null).length > 0) {
    const uploadPath = `attachments/${property.propertyGroup.nickname}/${property.jotFormId}/${replaceNonAlphaNumerics(property.agreements[0].tenant.firstName)}_${replaceNonAlphaNumerics(property.agreements[0].tenant.lastName)}/${sourceType}`;
    console.log(uploadPath);
    uploadJotFormFiles(property.jotFormId, attachmentType, uploadPath, readJotFormValue(record, field, null), s3Client);
  }
}
