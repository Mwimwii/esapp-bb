import { env } from 'process';
import { EntityManager } from 'typeorm';
import { Payment } from '../../models';
import { PaymentType } from '@titl-all/shared/dist/enum';
import { mapJsonPaymentMethod } from '../../mappers/mapJsonPaymentMethod';
import { mapJsonPaymentStatus } from '../../mappers/mapJsonPaymentStatus';

export async function importJSONFile(manager: EntityManager, jsonfile: string) {
  const fs = require('fs');
  const paymentRepo = manager.getRepository(Payment);

  const transactions = JSON.parse(fs.readFileSync(`${env.UPLOAD_DIR}/${jsonfile}`));
  console.log(transactions);
  const uploadedPayments = await paymentRepo.find({ select: ['paymentReference', 'paidWithAccount', 'completionDate'] });
  transactions.forEach((transaction: { Id: string; Phone: string; Amount: any; CreatedAt: any; Tenancy_TenantName: any; Status: any }) => {
    if (!uploadedPayments.find(p => p.paymentReference == transaction.Id && p.paidWithAccount == transaction.Phone)) {
      const payment = <Payment>({
        amount: transaction.Amount,
        paymentType: PaymentType.unknown,
        paymentMethod: mapJsonPaymentMethod(transaction.Phone),
        completionDate: transaction.CreatedAt,
        paymentReference: transaction.Id,
        paidBy: transaction.Tenancy_TenantName,
        paidWithAccount: transaction.Phone,
        status: mapJsonPaymentStatus(transaction.Status),
        xlSheetName: jsonfile
      });
      console.log(payment);
      paymentRepo.save(payment);
    }
  });
}
