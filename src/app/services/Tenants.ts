import { Agreement } from 'app/models';
import { PaymentType } from 'app/enums/PaymentType';

export class TenantsService {

  /**
   * All Tenants By Owner
   * @description grab all agreements, join properties and tenants
   * and conditionally join paymentPlans of two specifc types
   * given an owner ID
   */
  async allTenantsByOwner(ownerId: string) {
    const paymentTypes = [PaymentType.groundrent, PaymentType.leaserent];

    const agreements = await Agreement.createQueryBuilder('agreement')
      .innerJoinAndSelect('agreement.property', 'property')
      .innerJoinAndSelect('agreement.tenant', 'tenant')
      .innerJoinAndSelect('agreement.paymentPlans', 'paymentPlans',
                          'paymentPlans.paymentType IN (:...paymentTypes)',
                          { paymentTypes })
      .where({
        owner: ownerId
      })
      .getMany();


    return this.reorderByTenant(agreements);
  }

  /**
   * Reorder By Tenant
   * @description order all agreements by a tenant and use
   * the slim properties
   */
  reorderByTenant(agreements: Agreement[]) {
    const tenants = agreements.map((agreement: Agreement) => {
      const { property, tenant, paymentPlans } = agreement;
      const slimTenant = tenant.fields();
      const slimAgreement = agreement.fieldsNoRelations();

      // do agreements have more than one payment plans?
      if (paymentPlans.length > 1) {
        console.log(agreement)
      }

      return {
        ...slimTenant,
        property,
        agreement: slimAgreement,
        paymentPlan: paymentPlans.length > 0 ? paymentPlans[0] : [],
      }
    });

    return tenants;
  }
}
