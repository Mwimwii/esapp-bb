import { env } from 'process';
import { EntityManager } from 'typeorm';
import {
  PaymentMethod,
  PaymentStatus,
} from '@titl-all/shared/dist/enum';
import { Payment } from '../../models';
import { mapXLPaymentType } from './mapXLPaymentType';
import { readXLDate } from './readXLDate';

export function importXLSXFile(manager: EntityManager, xlsx: any) {
  const xlReader = require('xlsx');
  const paymentRepo = manager.getRepository(Payment);

  const xlfile = xlReader.readFile(`${env.UPLOAD_DIR}/${xlsx}`);

  xlfile.SheetNames.forEach(async (sheetname: any) => {
    if (!sheetname.toLowerCase().endsWith('details')) {
      console.log(sheetname);
      const temp = xlReader.utils.sheet_to_json(xlfile.Sheets[sheetname]);
      if (temp.length > 0) {
        console.log(temp.length);
        const uploadedPayments = await paymentRepo.find({ select: ['paymentReference', 'paidWithAccount', 'completionDate'] });
        temp.forEach((row: any) => {
          if (!uploadedPayments.find(p => p.paymentReference == row['TransactionID'] && p.paidWithAccount == row['Phone Number'])) {
            const payment = <Payment>({
              amount: row['Amount Paid'] || 0,
              paymentType: mapXLPaymentType(row['Paid for']),
              paymentMethod: PaymentMethod.momocollections,
              completionDate: readXLDate(row),
              paymentReference: row['TransactionID'],
              paidBy: row['Name'],
              paidWithAccount: row['Phone Number'],
              status: PaymentStatus.completed,
              xlSheetName: sheetname
            });
            console.debug(payment);
            paymentRepo.save(payment);
          }
        });
      }
    }
  });
}
