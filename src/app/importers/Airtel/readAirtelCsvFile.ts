import { S3Client } from '@aws-sdk/client-s3';
import { env } from 'process';
import { EntityManager } from 'typeorm';
import { Payment } from '../../models';
import { mapXLPaymentType } from '../Excel/mapXLPaymentType';
import { PaymentMethod } from '@titl-all/shared/dist/enum';
import { mapAirtelPaymentStatus } from '../../mappers/mapAirtelPaymentStatus';
import readline = require('readline');
import AWS = require('aws-sdk');
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

export function readAirtelCsvFile(manager: EntityManager, s3Client: S3Client, obj: any) {
  console.log(obj);
  const paymentRepo = manager.getRepository(Payment);
  const rl = readline.createInterface({
    input: s3.getObject({
      Bucket: env.AWS_BUCKET,
      Key: obj.key || obj.Key
    }).createReadStream()
  });

  rl.on('line', function (line) {
    const row = line.split(',');
    if (row.length > 10) {
      if (row[0] != 'Record No' && parseFloat(row[24]) > 0) {
        console.log(row);
        paymentRepo.findOne({ where: { paymentReference: row[1] } }).then(payment => {
          if (!payment) {
            payment = <Payment>({
              paymentType: mapXLPaymentType(row[2]),
              paidBy: row[8],
              paidWithAccount: row[7],
              amount: parseFloat(row[24]),
              initiationDate: new Date(row[3]),
              completionDate: new Date(row[3]),
              paymentMethod: PaymentMethod.airtelmoney,
              paidTo: row[17],
              paymentReference: row[1],
              narration: row[2],
              status: mapAirtelPaymentStatus(row[23]),
              xlSheetName: obj.key || obj.Key
            });
            paymentRepo.save(payment);
            console.log(payment);
          }
        });
      }
    }
  });
}
