import { Agreement, Property, Payment, PropertyGroup, Contact } from 'app/models';
import { PaymentType, AgreementStatus } from '@titl-all/shared/dist/enum';
import { PaymentPlanAPI, PaymentAPI } from '@titl-all/shared/dist/api-model';
import { LandownerDashboardData } from 'app/types';

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
      .innerJoinAndSelect('tenant.contactDetails', 'contactDetails')
      .leftJoinAndSelect('agreement.paymentPlans', 'paymentPlans',
                          'paymentPlans.paymentType IN (:...paymentTypes)',
                          { paymentTypes })
      .where({
        owner: ownerId
      })
      .orderBy('tenant.status', 'ASC')
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
      .select(`
              agreement.status as status,
              payments.amount as payment,
              paymentPlans.agreedAmount as agreed_amount,
              payments.createdAt as payment_created_at
      `)
      .innerJoin('agreement.tenant', 'tenant')
      .leftJoinAndSelect('agreement.paymentPlans', 'paymentPlans')
      .leftJoinAndSelect('paymentPlans.payments', 'payments')
      // TODO select a ticket
      .addSelect(
        qb => qb.select('Count(*)', 'property_groups')
        .from('property_groups', 'property_group')
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
      relations: ['property', 'owner', 'tenant', 'paymentPlans', 'tenant.contactDetails'],
      where: {
        owner: ownerId,
        tenant: {
          uuid: tenantUuid,
        },
      }
    });

    if (!agreement) {
      return {};
    }

    return this.reorderByTenantAgreement(agreement);
  }

  /**
   * Get Properties
   * @desc grab agreements, paymentPlans, and payments for a property
   * and calculate the total payments that have been made an export as an
   * additional property
   */
  async getProperties(ownerId: string) {
    const propertyGroups = await PropertyGroup.createQueryBuilder('property_group')
      .innerJoinAndSelect('property_group.properties', 'properties')
      .innerJoinAndSelect('properties.agreements', 'agreements')
      // only get properties that have a payment plan
      // if want all properties with no restrictions then this would be
      // leftJoinAndSelect
      .innerJoinAndSelect('agreements.paymentPlans', 'paymentPlans')
      .leftJoinAndSelect('paymentPlans.payments', 'payments')
      .where({
        owner: ownerId
      })
      .getMany();

    const calculatedPropertyGroups = propertyGroups.map(propertyGroup => {
      const { totalReceived, outstandingToReceive } = this.getPaymentsToReceiveFromPropertyGroups(propertyGroup);
      return {
        ...propertyGroup,
        totalReceived,
        outstandingToReceive,
      }
    });

    return calculatedPropertyGroups;
  }

  async getProperty(propertyUuid: string, ownerId: string) {
    const propertyGroup = await PropertyGroup.createQueryBuilder('property_group')
      .innerJoinAndSelect('property_group.properties', 'properties')
      .innerJoinAndSelect('properties.agreements', 'agreements')
      .innerJoinAndSelect('agreements.paymentPlans', 'paymentPlans')
      .leftJoinAndSelect('agreements.tenant', 'tenant')
      .leftJoinAndSelect('paymentPlans.payments', 'payments')
      .where({
        owner: ownerId,
        uuid: propertyUuid
      })
      .getOne();

      const { totalReceived, outstandingToReceive } = this.getPaymentsToReceiveFromPropertyGroups(propertyGroup as PropertyGroup);

      return {
        ...propertyGroup,
        totalReceived,
        outstandingToReceive,
      }
  }

  async getPayments(ownerId: string) {
    const payments = await Payment.createQueryBuilder('payment')
      .innerJoinAndSelect('payment.paymentPlan', 'paymentPlan')
      .innerJoinAndSelect('paymentPlan.payments', 'payments')
      .innerJoinAndSelect('paymentPlan.agreement', 'agreement')
      .where('agreement.owner= :ownerId', { ownerId })
      .getMany();

    if (payments.length === 0) {
      return { totalPayment: 0, payments, currency: ''};
    }

    const totalPayments = payments.reduce((acc: number, payment: Payment) => acc + Number(payment.amount), 0);
    const [{ paymentPlan: { currency } }] = payments;

    return { totalPayments, currency, payments };
  }


  /**
   * Process Overview
   * @description take in some agreement tenant data and perform calculations on
   * the data to provide overview data
   */
  private processOverview(data: Partial<Agreement>[] & LandownerDashboardData[]) {
    const [{ totalPropertyCount: totalProperties }] = data;

    const overview = {
      totalTenants: data.length,
      totalProperties: Number(totalProperties),
      totalPayment: data.reduce((acc: number, info: LandownerDashboardData) => acc + Number(info.payment), 0),
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
    const slimTenant = this.restrictContactDetails(tenant.fields());
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

  private restrictContactDetails(tenant: Partial<Contact>) {
    const { contactDetails } = tenant;
    const filteredTenant = contactDetails?.filter(contactDetail => {
      return contactDetail.preferred;
    });

    return { ...tenant, contactDetails: filteredTenant };
  }

  private getPaymentsToReceiveFromPropertyGroups(propertyGroup: PropertyGroup) {
    let totalReceived = 0;
    let outstandingToReceive = 0;

    const { properties } = propertyGroup;
    properties.map(property => {
      const { agreements } = property;
      agreements.map(agreement => {
        const { paymentPlans } = agreement;
        paymentPlans.map(paymentPlan => {
          const { payments, outstandingAmount } = paymentPlan;
          if (payments.length > 0) {
            totalReceived += payments.reduce((acc: number, payment: PaymentAPI) => acc + Number(payment.amount), 0);
          }
          outstandingToReceive += Number(outstandingAmount);
        })
      })
    })

    return { totalReceived, outstandingToReceive };
  }

  private calculateOutstandingAmountFromProperty(property: Property) {
    const { agreements } = property;
    return {
      ...property,
      agreements: agreements.map((agreement: Agreement) => {
        const { paymentPlans } = agreement;
        return {
          ...agreement,
          paymentPlans: paymentPlans.map((paymentPlan: PaymentPlanAPI) => {
            const { payments, agreedAmount } = paymentPlan;
            if (payments.length > 0) {
              const totalPaid = payments.reduce((acc: number, payment: PaymentAPI) => acc + Number(payment.amount), 0);
              const outstandingAmount = Number(agreedAmount) - totalPaid;

              paymentPlan.totalPaid = totalPaid;
              paymentPlan.calculatedOutstandingAmount = outstandingAmount;
            }
            return {...paymentPlan};
          })}
      })}
  }

}
