import {
  Agreement,
  Payment,
  PropertyGroup,
  Contact,
  Ticket,
  TicketCollaborator,
  User,
} from 'app/models';
import { PaymentType, AgreementStatus, SourceType } from '@titl-all/shared/dist/enum';
import { PaymentAPI, TicketAPI } from '@titl-all/shared/dist/api-model';
import { LandownerDashboardData } from 'app/types';

export class LandOwnersService {

  async allTenantsByOwnerId(ownerId: string) {
    const tenants = await Contact.createQueryBuilder('contact')
      .innerJoin('contact.agreements', 'agreement', 'agreement.ownerId= :ownerId', { ownerId: ownerId })
      .innerJoinAndSelect('contact.contactDetails', 'contactDetails')
      .loadRelationCountAndMap('contact.assetsCount', 'contact.assets')
      .getMany();

    const result = tenants.map(tenant => this.restrictContactDetails(tenant.fields()));

    return result;
  }

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
   * All Ticket By Tenant
   * @desc grab all tickets this landowner has grouped
   * by tenants/users
   */
  async allTicketsByTenant(ownerUserId: string) {
    const tickets = await Ticket.createQueryBuilder('ticket')
      .where({
        sourceTypeId: Number(ownerUserId)
      })
      .innerJoinAndSelect('ticket.user', 'user')
      .orderBy('ticket.userId')
      .getMany();

    const ticketsCollaboratingOn = await TicketCollaborator.createQueryBuilder('ticket_collaborator')
      .innerJoinAndSelect('ticket_collaborator.ticket', 'ticket')
      .innerJoinAndSelect('ticket.user', 'user')
      .leftJoinAndSelect('user.contact', 'contact')
      .where({
        user: ownerUserId
      })
      .getMany();

    return await this.reconcileTickets(tickets, ticketsCollaboratingOn);
  }

  async getTicket(ownerUserId: string, ticketUuid: string) {
    const ticket = await Ticket.createQueryBuilder('ticket')
      .where({
        uuid: ticketUuid,
        sourceTypeId: Number(ownerUserId),
      })
      .innerJoinAndSelect('ticket.user', 'user')
      .orderBy('ticket.userId')
      .getOne();

    const ticketCollaboratingOn = await TicketCollaborator.createQueryBuilder('ticket_collaborator')
      .innerJoinAndSelect('ticket_collaborator.ticket', 'ticket')
      .innerJoinAndSelect('ticket.user', 'user')
      .leftJoinAndSelect('user.contact', 'contact')
      .where({
        user: ownerUserId
      })
      .andWhere('ticket.uuid = :ticketUuid', { ticketUuid })
      .getOne();

    if (!ticket && !ticketCollaboratingOn) {
      return;
    }

    const foundTicket = ticket ? ticket : ticketCollaboratingOn?.ticket;
    const ticketSource = await this.getTicketSourceTypes(foundTicket as TicketAPI);

    return ticketSource;
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
    const totalTenants = await Agreement.count({ where: { owner: ownerId } });

    const paymentStatus: any[] = await getConnection().query(`SELECT a."status", sum(pp."agreedAmount") agreedAmount, SUM(pp."requestedAmount") requestedAmount, SUM(pp."outstandingAmount") outstandingAmount, sum(pp."agreedAmount")-  SUM(pp."outstandingAmount") collected FROM payment_plans pp JOIN agreements a on pp."agreementId" = a.id WHERE a."ownerId" = ${ownerId}  GROUP BY a."status" HAVING a."status"::text = 'Agreed With Owner'`, []);

    const totalPropertyGroups = await PropertyGroup.count({ where: { owner: ownerId } });

    const agreementsByStatus = await getConnection()
      .createQueryBuilder()
      .select('agreements.status', 'status')
      .addSelect('COUNT(1)', 'count')
      .from(Agreement, 'agreements')
      .where('agreements.ownerId=:ownerId', { ownerId: ownerId })
      .groupBy('agreements.status')
      .orderBy('count', 'DESC')
      .getRawMany();

    const tenantsAgreementStatus = {
      agreed: this.agreementStatusCount(agreementsByStatus, 'agreed'),
      negotiated: this.agreementStatusCount(agreementsByStatus, 'negotiated'),
      identified: this.agreementStatusCount(agreementsByStatus, 'identified'),
      hasError: this.agreementStatusCount(agreementsByStatus, 'hasError'),
    };

    return { totalTenants, totalProperties: totalPropertyGroups, paymentStatus: paymentStatus[0], agreementsByStatus: tenantsAgreementStatus };
  }

  async getTenantAndPaymentPlan(tenantUuid: string, ownerId: string) {
    const agreement = await Agreement.findOne({
      relations: ['property', 'owner', 'tenant', 'paymentPlans', 'paymentPlans.payments', 'tenant.contactDetails', 'tenant.assets', 'assets'],
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

  async getTenantBucketList(tenantUuid: string, ownerId: string) {
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
      return { totalPayment: 0, payments, currency: '' };
    }

    const totalPayments = payments.reduce((acc: number, payment: Payment) => acc + Number(payment.amount), 0);
    const [{ paymentPlan: { currency } }] = payments;

    return { totalPayments, currency, payments };
  }


  toWholeNumber(num: number): number {
    if (num > 0) {
      return num;
    }
    return 0;
  }
  /**
   * Process Overview
   * @description take in some agreement tenant data and perform calculations on
   * the data to provide overview data
   */
  private processOverview(data: LandownerDashboardData[] & Partial<Agreement>[]) {
    const [{ totalPropertyCount: totalProperties }] = data;
    const overview = {
      totalTenants: new Set<number>(data.map(item => item.tenant_id)).size,
      totalProperties: Number(totalProperties),
      totalPayment: data.reduce((acc: number, info: LandownerDashboardData) => acc + Number(info.payment), 0),
      outstandingFees: data.reduce((acc: number, info: LandownerDashboardData) => acc + this.toWholeNumber(Number(info.agreed_amount) - Number(info.payment)), 0),
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
  private agreementStatusCount(data: Partial<Agreement>[], status: string): number {
    let count = 0;

    switch (status) {
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
    const assets = tenant.assets ? tenant.assets.map(asset => asset.fieldsNoRelations()) : [];
    // do agreements have more than one payment plans?
    if (paymentPlans.length > 1) {
      console.log(agreement)
    }

    return {
      ...slimTenant,
      property,
      agreement: slimAgreement,
      paymentPlan: paymentPlans.length > 0 ? paymentPlans[0] : [],
      assets
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

  /**
   * Reconcile Tickets
   * @desc get the source type if a contact or user and join any tickets
   * collaborating on and included on
   */
  private async reconcileTickets(tickets: TicketAPI[], ticketsCollaboratingOn: TicketCollaborator[]): Promise<Ticket[]> {
    const ticketsWithSourceInfo = await Promise.all(tickets.map(async (ticket: TicketAPI) => {
      const ticketSource = await this.getTicketSourceTypes(ticket);
      return ticketSource;
    }));

    const reorderdTicketsCollaboratingOn = await Promise.all(ticketsCollaboratingOn.map(async (ticketCollabrator: TicketCollaborator) => {
      const ticketSource = await this.getTicketSourceTypes(ticketCollabrator.ticket);
      return ticketSource;
    }));

    return [
      ...ticketsWithSourceInfo as unknown as Ticket[],
      ...reorderdTicketsCollaboratingOn as unknown as Ticket[]
    ];
  }

  private async getTicketSourceTypes(ticket: TicketAPI) {
    if (ticket.sourceType === SourceType.contact) {
      const contact = await Contact.findOne({
        where: {
          id: Number(ticket.sourceTypeId)
        }
      });
      ticket.sourceTypeContact = contact;
    }

    if (ticket.sourceType === SourceType.user) {
      const user = await User.findOne({
        where: {
          id: Number(ticket.sourceTypeId)
        }
      });
      ticket.sourceTypeUser = user;
    }

    return ticket;
  }
}
