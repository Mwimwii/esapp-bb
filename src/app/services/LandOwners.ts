import { Agreement } from 'app/models';
import { PaymentType } from 'app/enums/PaymentType';
import { AgreementStatus } from '../enums/AgreementStatus';

export class LandOwnersService {

  /**
   * All Tenants
   * @description grab all agreements, join properties and tenants
   * and conditionally join paymentPlans of two specifc types
   * given an owner ID
   */
  async allTenantsWithRentPaymentPlans(ownerId: string) {
    const paymentTypes = [PaymentType.groundrent, PaymentType.leaserent];

    const agreements = await Agreement.createQueryBuilder('agreement')
      .innerJoinAndSelect('agreement.property', 'property')
      .innerJoinAndSelect('agreement.tenant', 'tenant')
      .leftJoinAndSelect('agreement.paymentPlans', 'paymentPlans',
                          'paymentPlans.paymentType IN (:...paymentTypes)',
                          { paymentTypes })
      .where({
        owner: ownerId
      })
      .getMany();


    return this.reorderByTenant(agreements);
  }

  /**
   * Overview
   * @description grab overview information about the land owner
   * for display on the dashboard
   * Info to display:
   *  - Total number of tenants
   *  - Total number of properties
   *  - Payment status
   *      - Money collected today
   *      - Total money collected
   *      - Projected money to collect
   *  - Tenant status => enum: Agreement.status
   *      - # of Tenants onboarded
   *      - # of Tenants negotiated
   *      - # of Tenants identified
   *      - # of Tenants defaulted
   *  - Requests (Tickets)
   *      - # of Land tickets
   *      - # of conflict tickets
   *      - # of rent tickets
   */
  async overview(ownerId: string) {
    const landOwnerOverview = await Agreement.createQueryBuilder('agreement')
      .select('agreement.status as status')
      .innerJoin('agreement.tenant', 'tenant')
      .leftJoinAndSelect('agreement.paymentPlans', 'paymentPlans')
      // TODO select a ticket
      .addSelect(
        qb => qb.select('Count(*)', 'properties')
        .from('property', 'property')
        .where({ owner: ownerId }), 'totalPropertyCount'
      )
      .where({
        owner: ownerId
      })
      .getRawMany();

      return landOwnerOverview.length > 0 ? this.processOverview(landOwnerOverview) : [];
  }

  /**
   * Process Overview
   * @description take in some agreement tenant data and perform calculations on
   * the data to provide overview data
   */
  processOverview(data: Partial<Agreement>[] & { totalPropertyCount: string }[]) {
    const [{ totalPropertyCount: totalProperties }] = data;

    const overview = {
      totalTenants: data.length,
      totalProperties: Number(totalProperties),
      tenantsAgreementStatus: {
        onboarded: data.filter(agreement => agreement.status === AgreementStatus.active).length,
        negotiated: data.filter(agreement => agreement.status === AgreementStatus.negperformed).length,
        identified: data.filter(agreement => agreement.status === AgreementStatus.identified).length,
      }
    };

    return overview;
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
