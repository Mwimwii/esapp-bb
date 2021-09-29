import { Agreement } from 'app/models';

export class TenantsService {
  reorder(agreements: Agreement[]) {
    const tenants = agreements.map((agreement: Agreement) => {
      const { property, tenant, paymentPlans } = agreement;
      const slimTenant = tenant.fields();

      // do agreements have more than one payment plans?
      if (paymentPlans.length > 1) {
        console.log(agreement)
      }

      return {
        ...slimTenant,
        property,
        agreement,
        paymentPlans: paymentPlans.length > 0 ? paymentPlans[0] : [],
      }
    });

    return tenants;
  }
}
