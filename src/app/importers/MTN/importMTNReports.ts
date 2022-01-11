import { env } from 'process';
import { EntityManager } from 'typeorm';
import AWS = require('aws-sdk');
import { readMtnCsvFile } from './readMtnCsvFile';
import { updateRelations } from '../airtable/updateRelations';

export const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

export function importMTNReports(manager: EntityManager) {
  s3.listObjectsV2({
    Bucket: env.AWS_BUCKET || 'titl',
    Prefix: 'reports/mtn/' // Can be your folder name
  }, function (err, data) {
    if (err)
      console.log(err, err.stack); // an error occurred
    else {
      console.log(data.Contents);
      data.Contents?.forEach(obj => {

        if (obj.Key?.startsWith('reports/mtn/')) {
          readMtnCsvFile(manager, obj);
        }
      });
      updateRelations(manager);
    }
  });
}

