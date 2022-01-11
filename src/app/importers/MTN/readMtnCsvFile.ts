import { S3Client } from '@aws-sdk/client-s3';
import { env } from 'process';
import { EntityManager } from 'typeorm';
import { Payment } from '../../models';
import { PaymentMethod, PaymentType } from '@titl-all/shared/dist/enum';
import { mapAirtelPaymentStatus } from '../../mappers/mapAirtelPaymentStatus';
import readline = require('readline');
import AWS = require('aws-sdk');
import { cleanMtnNumber } from './cleanMtnNumber';
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

export function readMtnCsvFile(manager: EntityManager, s3Client: S3Client, obj: any) {
  console.log(obj);
  const paymentRepo = manager.getRepository(Payment);

  const rl = readline.createInterface({
    input: s3.getObject({
      Bucket: env.AWS_BUCKET || 'titl',
      Key: obj.Key || obj.key
    }).createReadStream()
  });

  rl.on('line', function (line) {
    const row = line.replace(/\"/g, '').split(',');
    if (row.length > 10) {
      if (row[0] != 'Id' && parseFloat(row[16]) > 0) {
        console.log(row);
        paymentRepo.findOne({ where: { paymentReference: row[0] } }).then(payment => {
          if (!payment) {
            payment = <Payment>({
              paymentType: PaymentType.unknown,
              paidBy: row[9],
              paidWithAccount: cleanMtnNumber(row[8]),
              amount: parseFloat(row[16]),
              initiationDate: new Date(row[2]),
              completionDate: new Date(row[2]),
              paymentMethod: PaymentMethod.momomerchant,
              paidTo: cleanMtnNumber(row[11]),
              paymentReference: row[0],
              narration: row[7],
              status: mapAirtelPaymentStatus(row[3]),
              xlSheetName: obj.Key || obj.key
            });
            paymentRepo.save(payment);
            console.log(payment);
          }
        });
      }
    }
  });
}
