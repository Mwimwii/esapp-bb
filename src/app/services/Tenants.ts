import { Agreement } from 'app/models';

export class TenantsService {
  reorder(agreements: Agreement[]) {
    const tenants = agreements.map((agreement: Agreement) => {
      const { property, tenant } = agreement;
      const slimTenant = tenant.fields();

      return {
        ...slimTenant,
        property,
        agreement,
      }
    });

    return tenants;
  }
}
