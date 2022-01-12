import { env } from 'process';
import { EntityManager } from 'typeorm';
import { updateRelations } from '../airtable/updateRelations';
import { readAirtelCsvFile } from './readAirtelCsvFile';

const AWS = require('aws-sdk');
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

export function importAirtelReports(manager: EntityManager) {
  s3.listObjectsV2({
    Bucket: env.AWS_BUCKET,
    Prefix: 'reports/airtel/' // Can be your folder name
  }, function (err: { stack: any }, data: { Contents: any[] }) {
    if (err)
      console.log(err, err.stack); // an error occurred
    else {
      console.log(data.Contents);
      data.Contents.forEach((obj: { Key: string }) => {

        if (obj.Key.startsWith('reports/airtel/')) {
          readAirtelCsvFile(manager, obj);
        }
      });
      updateRelations(manager);
    }
  });
}


