import { Attachment, Property } from '../../models';
import { EntityManager } from 'typeorm';
import { readJotFormValue } from '../../utils/jotform/readJotFormValue';
import {
  AttachmentType,
  SourceType,
} from '@titl-all/shared/dist/enum';
import { S3Client } from '@aws-sdk/client-s3';
import { uploadJotFormFiles } from './uploadJotFormFiles';
import { replaceNonAlphaNumerics } from '../../utils/replaceNonAlphaNumerics';

export function processJotformFiles(manager: EntityManager, record: any, field: number, attachmentType: AttachmentType, sourceType: SourceType, property: Property, s3Client: S3Client) {
  if (readJotFormValue(record, field, null).length > 0) {
    const uploadPath = `attachments/${property.propertyGroup.nickname}/${property.jotFormId}/${replaceNonAlphaNumerics(property.agreements[0].tenant.firstName)}_${replaceNonAlphaNumerics(property.agreements[0].tenant.lastName)}/${attachmentType}`;
    console.log(uploadPath);
    uploadJotFormFiles(property.jotFormId, sourceType, uploadPath, manager.getRepository(Attachment), readJotFormValue(record, field, null), s3Client);
  }
}
