import { EntityManager } from 'typeorm';
import { Payment } from '../../models';
import { mapXLPaymentType } from '../Excel/mapXLPaymentType';
import { PaymentMethod } from '@titl-all/shared/dist/enum';
import { mapAirtelPaymentStatus } from '../../mappers/mapAirtelPaymentStatus';
import readline = require('readline');
import AWS = require('aws-sdk');
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

export function readAirtelCsvFile(manager: EntityManager, obj: any) {
  console.log(obj);
  const paymentRepo = manager.getRepository(Payment);
  const rl = readline.createInterface({
    input: s3.getObject({
      Bucket: process.env.AWS_BUCKET || 'titl',
      Key: obj.Key || obj.key
    }).createReadStream()
  });

  rl.on('line', function (line) {
    const row = line.split(',');
    if (row.length > 10) {
      if (row[0] != 'Record No' && parseFloat(row[24]) > 0) {
        console.log(row);
        paymentRepo.findOne({ where: { paymentReference: row[1] } }).then(payment => {
          if (!payment) {
            payment = {
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
            } as Payment;
            paymentRepo.save(payment);
            console.log(payment);
          }
        });
      }
    }
  });
}
