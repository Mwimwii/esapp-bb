import { Agreement } from 'app/models';
import { PaymentType, AgreementStatus } from '@titl-all/shared/dist/enum';

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

    return this.reorderByTenantAgreements(agreements);
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
   *      - # of Tenants agreed
   *      - # of Tenants negotiated
   *      - # of Tenants identified
   *      - # of Tenants erored
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
        .from('properties', 'property')
        .where({ owner: ownerId }), 'totalPropertyCount'
      )
      .where({
        owner: ownerId
      })
      .getRawMany();

    return landOwnerOverview.length > 0 ? this.processOverview(landOwnerOverview) : [];
  }

  async getTenantAndPaymentPlan(tenantUuid: string, ownerId: string) {
    const agreement = await Agreement.findOne({
      relations: ['property', 'tenant', 'paymentPlans'],
      where: {
        owner: ownerId,
        tenant: {
          uuid: tenantUuid
        },
      }
    });

    if (!agreement) {
      return {};
    }

    return this.reorderByTenantAgreement(agreement);
  }

  /**
   * Process Overview
   * @description take in some agreement tenant data and perform calculations on
   * the data to provide overview data
   */
  private processOverview(data: Partial<Agreement>[] & { totalPropertyCount: string }[]) {
    const [{ totalPropertyCount: totalProperties }] = data;

    const overview = {
      totalTenants: data.length,
      totalProperties: Number(totalProperties),
      tenantsAgreementStatus: {
        agreed: this.agreementStatusCount(data, 'agreed'),
        negotiated: this.agreementStatusCount(data, 'negotiated'),
        identified: this.agreementStatusCount(data, 'identified'),
        hasError: this.agreementStatusCount(data, 'hasError'),
      }
    };

    return overview;
  }

  /**
   * Agreement Status Count
   * @description given some agreement data filter our the data given a status
   * to get a count for that type of agreement
   */
  agreementStatusCount(data: Partial<Agreement>[], status: string): number {
    let count = 0;

    switch(status) {
      case 'agreed':
        count = data.filter(
          agreement =>
            agreement.status === AgreementStatus.active ||
            agreement.status === AgreementStatus.negagreed
        ).length
        break;
      case 'negotiated':
        count = data.filter(
          agreement =>
            agreement.status === AgreementStatus.negperformed ||
            agreement.status === AgreementStatus.negmissingdocs ||
            agreement.status === AgreementStatus.negready
      ).length
      break;
      case 'identified':
        count = data.filter(
          agreement =>
            agreement.status === AgreementStatus.identified ||
            agreement.status === AgreementStatus.contacted ||
            agreement.status === AgreementStatus.contactedfail ||
            agreement.status === AgreementStatus.negplanned
      ).length
      break;
      case 'hasError':
        count = data.filter(
          agreement =>
            agreement.status === AgreementStatus.expired ||
            agreement.status === AgreementStatus.conflicted ||
            agreement.status === AgreementStatus.breached ||
            agreement.status === AgreementStatus.fake
      ).length
      break;
    }

    return count;
  }

  /**
   * Reorder By Tenant Agreements
   * @description order all agreements by a tenant and use
   * the slim properties
   */
  private reorderByTenantAgreements(agreements: Agreement[]) {
    const tenants = agreements.map((agreement: Agreement) => {
      return this.reorderByTenantAgreement(agreement);
    });

    return tenants;
  }

  private reorderByTenantAgreement(agreement: Agreement) {
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
  }

}
