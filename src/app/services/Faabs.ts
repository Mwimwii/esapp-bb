import { Faabs, FaabsAttendance, FaabsTopic, Farmer } from 'app/models';
// import { FaabsAPI } from 'app/types';

export class FaabsService {

  // /**
  //  * All FaabsGrous
  //  */
  async allFaabsGroups(campId: string) {
    const faabs = await Faabs.createQueryBuilder('faabs')
      .leftJoinAndSelect('faabs.farmers', 'farmers')
      .leftJoinAndSelect('faabs.camp', 'camp')
      .leftJoinAndSelect('faabs.topics', 'topics')
      .leftJoinAndSelect('faabs.attendance', 'attendance')
      // .leftJoinAndSelect('attendance.farmers', 'attendance.farmers')

      .where({
        camp: campId
      })
      .getMany();

    return faabs;
  }
  async allFaabsTopics() {
    const faabs = await FaabsTopic.createQueryBuilder('topics')
      .getMany();
    return faabs;
  }

  async add(data: any) {
    const {
      name,
      description,
      topics,
      maxAttendedTopics,
      campId,
      latitude,
      longitude
    } = data;
    console.log(maxAttendedTopics)
    const faabs = new Faabs();

    const topic = await FaabsTopic.findByIds([topics]);
    faabs.topics = topic;

    faabs.name = name;
    faabs.description = description;
    faabs.camp = campId;
    faabs.latitude = latitude;
    faabs.longitude = longitude;
    faabs.maxAttendedTopics = Number (maxAttendedTopics);
    faabs.status = 1;

    await faabs.save();

    return faabs;
  }

  async addAttendance(data: any) {
    const {
      faabsGroup,
      farmers,
      topic,
      facilitators,
      partnerOrganisations,
      trainingDate,
      duration,
      quarter,
      trainingType
    } = data;

    const faabsAttendance = new FaabsAttendance();

    faabsAttendance.faabsGroup = faabsGroup
    faabsAttendance.farmers = await Farmer.findByIds(farmers)
    faabsAttendance.topic = topic
    faabsAttendance.facilitators = facilitators
    faabsAttendance.partnerOrganisations = partnerOrganisations
    faabsAttendance.trainingDate = trainingDate
    faabsAttendance.duration = duration
    faabsAttendance.quarter = quarter
    faabsAttendance.trainingType = trainingType

    await faabsAttendance.save();
    return faabsAttendance;
  }
  // async getTicket(ownerUserId: string, ticketUuid: string) {
  //   const ticket = await Ticket.createQueryBuilder('ticket')
  //     .where({
  //       uuid: ticketUuid,
  //       sourceTypeId: Number(ownerUserId),
  //     })
  //     .innerJoinAndSelect('ticket.user', 'user')
  //     .orderBy('ticket.userId')
  //     .getOne();

  //   const ticketCollaboratingOn = await TicketCollaborator.createQueryBuilder('ticket_collaborator')
  //     .innerJoinAndSelect('ticket_collaborator.ticket', 'ticket')
  //     .innerJoinAndSelect('ticket.user', 'user')
  //     .leftJoinAndSelect('user.contact', 'contact')
  //     .where({
  //       user: ownerUserId
  //     })
  //     .andWhere('ticket.uuid = :ticketUuid', { ticketUuid })
  //     .getOne();

  //   if (!ticket && !ticketCollaboratingOn) {
  //     return;
  //   }

  //   const foundTicket = ticket ? ticket : ticketCollaboratingOn?.ticket;
  //   const ticketSource = await this.getTicketSourceTypes(foundTicket as TicketAPI);

  //   return ticketSource;
  // }

  // /**
  //  * Overview
  //  * @description grab overview information about the land owner
  //  * for display on the dashboard
  //  * Info to display:
  //  *  - Total number of tenants
  //  *  - Total number of properties
  //  *  - Payment status
  //  *      - Money collected today
  //  *      - Total money collected
  //  *      - Projected money to collect
  //  *  - Tenant status => enum: Agreement.status
  //  *      - # of Tenants agreed
  //  *      - # of Tenants negotiated
  //  *      - # of Tenants identified
  //  *      - # of Tenants erored
  //  *  - Requests (Tickets)
  //  *      - # of Land tickets
  //  *      - # of conflict tickets
  //  *      - # of rent tickets
  //  */
  // async overview(ownerId: string) {
  //   const totalTenantsResult = await getConnection().query(`SELECT COUNT(DISTINCT "agreements"."tenantId") FROM "agreements" "agreements" WHERE "agreements"."ownerId" =${ownerId};`);

  //   const paymentStatus: (string | number)[] = await getConnection().query(`SELECT a."status",\
  //                                                             SUM(pp."agreedAmount") agreedAmount,\
  //                                                             SUM(pp."requestedAmount") requestedAmount,\
  //                                                             SUM(pp."outstandingAmount") outstandingAmount,\
  //                                                             SUM(pp."agreedAmount") - SUM(pp."outstandingAmount") collected\
  //                                                             FROM payment_plans pp \
  //                                                             JOIN agreements a on pp."agreementId" = a.id \
  //                                                             WHERE a."ownerId" = ${ownerId}  \
  //                                                             GROUP BY a."status" HAVING a."status"::text = 'Agreed With Owner'`, []);

  //   const totalPropertyGroups = await PropertyGroup.count({ where: { owner: ownerId } });

  //   const agreementsByStatus = await getConnection()
  //     .createQueryBuilder()
  //     .select('agreements.status', 'status')
  //     .addSelect('COUNT(1)', 'count')
  //     .from(Agreement, 'agreements')
  //     .where('agreements.ownerId=:ownerId', { ownerId: ownerId })
  //     .groupBy('agreements.status')
  //     .orderBy('count', 'DESC')
  //     .getRawMany();

  //   const tenantsAgreementStatus = {
  //     agreed: this.agreementStatusCount(agreementsByStatus, 'agreed'),
  //     negotiated: this.agreementStatusCount(agreementsByStatus, 'negotiated'),
  //     identified: this.agreementStatusCount(agreementsByStatus, 'identified'),
  //     hasError: this.agreementStatusCount(agreementsByStatus, 'hasError'),
  //   };

  //   return { totalTenants: Number(totalTenantsResult[0]?.count), totalProperties: totalPropertyGroups, paymentStatus: paymentStatus[0], agreementsByStatus: tenantsAgreementStatus };
  // }

  // async getTenantAndPaymentPlan(tenantUuid: string, ownerId: string) {
  //   const agreements = await Agreement.createQueryBuilder('agreement')
  //     .innerJoinAndSelect('agreement.property', 'property')
  //     .innerJoinAndSelect('property.propertyGroup', 'propertyGroup')
  //     .innerJoin('property.owner', 'owner')
  //     .innerJoinAndSelect('agreement.tenant', 'tenant')
  //     .innerJoinAndSelect('tenant.contactDetails', 'contactDetails')
  //     .leftJoinAndSelect('tenant.assets', 'assets')
  //     .leftJoinAndSelect('agreement.paymentPlans', 'paymentPlans')
  //     .leftJoinAndSelect('paymentPlans.payments', 'paymentPlans.payments')
  //     .where({
  //       owner: ownerId,
  //       tenant: {
  //         uuid: tenantUuid,
  //       },
  //     })
  //     .orderBy('tenant.status', 'ASC')
  //     .getMany();
  //   if (!agreements) {
  //     return {};
  //   }
  //   return this.reorderByTenantAgreements(agreements);
  // }

  // async getTenantBucketList(tenantUuid: string, ownerId: string) {
  //   const agreement = await Agreement.findOne({
  //     relations: ['property', 'owner', 'tenant', 'paymentPlans', 'tenant.contactDetails'],
  //     where: {
  //       owner: ownerId,
  //       tenant: {
  //         uuid: tenantUuid,
  //       },
  //     }
  //   });

  //   if (!agreement) {
  //     return {};
  //   }

  //   return this.reorderByTenantAgreement(agreement);
  // }

  // /**
  //  * Get Properties
  //  * @desc grab agreements, paymentPlans, and payments for a property
  //  * and calculate the total payments that have been made an export as an
  //  * additional property
  //  */
  // async getProperties(ownerId: string) {
  //   const propertyGroups = await PropertyGroup.createQueryBuilder('property_group')
  //     .innerJoinAndSelect('property_group.properties', 'properties')
  //     .innerJoinAndSelect('properties.agreements', 'agreements')
  //     // only get properties that have a payment plan
  //     // if want all properties with no restrictions then this would be
  //     // leftJoinAndSelect
  //     .innerJoinAndSelect('agreements.paymentPlans', 'paymentPlans')
  //     .leftJoinAndSelect('paymentPlans.payments', 'payments')
  //     .where({
  //       owner: ownerId
  //     })
  //     .getMany();

  //   const calculatedPropertyGroups = propertyGroups.map(propertyGroup => {
  //     const { totalReceived, outstandingToReceive } = this.getPaymentsToReceiveFromPropertyGroups(propertyGroup);
  //     return {
  //       ...propertyGroup,
  //       totalReceived,
  //       outstandingToReceive,
  //     }
  //   });

  //   return calculatedPropertyGroups;
  // }

  // async getProperty(propertyUuid: string, ownerId: string) {
  //   const propertyGroup = await PropertyGroup.createQueryBuilder('property_group')
  //     .innerJoinAndSelect('property_group.properties', 'properties')
  //     .innerJoinAndSelect('properties.agreements', 'agreements')
  //     .innerJoinAndSelect('agreements.paymentPlans', 'paymentPlans')
  //     .leftJoinAndSelect('agreements.tenant', 'tenant')
  //     .leftJoinAndSelect('paymentPlans.payments', 'payments')
  //     .where({
  //       owner: ownerId,
  //       uuid: propertyUuid
  //     })
  //     .getOne();

  //   const { totalReceived, outstandingToReceive } = this.getPaymentsToReceiveFromPropertyGroups(propertyGroup as PropertyGroup);
  //   const paymentPlans = propertyGroup?.properties
  //     .flatMap(property => property.agreements)
  //     .flatMap(agreement => agreement.paymentPlans)
  //     .filter(agreement => agreement.payments.length > 0) || [];
  //   const overview = { ...this.getPaymentPlansTotal(paymentPlans), Total: { outstanding: outstandingToReceive, collected: totalReceived } };
  //   return {
  //     ...propertyGroup,
  //     overview
  //   }
  // }

  // private getPaymentTotal(payments: PaymentAPI[]) {
  //   return payments.reduce((acc: number, curr) => {
  //     acc += Number(curr.amount)
  //     return acc
  //   }, 0)
  // }
  // private getPaymentPlansTotal(paymentPlans: PaymentPlanAPI[]) {
  //   return paymentPlans.reduce((acc: { [key: string]: any }, curr) => {
  //     if (acc[curr.paymentType]) {
  //       acc[curr.paymentType].outstanding += curr.outstandingAmount ? Number(curr.outstandingAmount) : 0
  //       acc[curr.paymentType].collected += curr.payments ? this.getPaymentTotal(curr.payments) : 0
  //     } else {
  //       acc[curr.paymentType] = { outstanding: 0, collected: 0 }
  //       acc[curr.paymentType].outstanding += curr.outstandingAmount ? Number(curr.outstandingAmount) : 0
  //       acc[curr.paymentType].collected += curr.payments ? this.getPaymentTotal(curr.payments) : 0

  //     }
  //     return acc
  //   }, {})
  // }

  // async getPayments(ownerId: string) {
  //   const payments = await Payment.createQueryBuilder('payment')
  //     .innerJoinAndSelect('payment.paymentPlan', 'paymentPlan')
  //     .innerJoinAndSelect('paymentPlan.payments', 'payments')
  //     .innerJoinAndSelect('paymentPlan.agreement', 'agreement')
  //     .where('agreement.owner= :ownerId', { ownerId })
  //     .getMany();

  //   if (payments.length === 0) {
  //     return { totalPayment: 0, payments, currency: '' };
  //   }
  //   const totalPayments = payments.reduce((acc: number, payment: Payment) => acc + Number(payment.amount), 0);
  //   const [{ paymentPlan: { currency } }] = payments;
  //   return { totalPayments, currency, payments };
  // }


  // toWholeNumber(num: number): number {
  //   if (num > 0) {
  //     return num;
  //   }
  //   return 0;
  // }

  // /**
  //  * Agreement Status Count
  //  * @description given some agreement data filter our the data given a status
  //  * to get a count for that type of agreement
  //  */
  // private agreementStatusCount(data: any[], status: string): number {
  //   let count = 0;

  //   switch (status) {
  //     case 'agreed':
  //       count = data.filter(
  //         agreement =>
  //           agreement.status === AgreementStatus.active ||
  //           agreement.status === AgreementStatus.negagreed
  //       ).map(f => Number(f.count)).reduce((a: number, b: number) => a + b, 0);
  //       break;
  //     case 'negotiated':
  //       count = data.filter(
  //         agreement =>
  //           agreement.status === AgreementStatus.negperformed ||
  //           agreement.status === AgreementStatus.negmissingdocs ||
  //           agreement.status === AgreementStatus.negready
  //       ).map(f => Number(f.count)).reduce((a: number, b: number) => a + b, 0);
  //       break;
  //     case 'identified':
  //       count = data.filter(
  //         agreement =>
  //           agreement.status === AgreementStatus.identified ||
  //           agreement.status === AgreementStatus.contacted ||
  //           agreement.status === AgreementStatus.contactedfail ||
  //           agreement.status === AgreementStatus.negplanned
  //       ).map(f => Number(f.count)).reduce((a: number, b: number) => a + b, 0);
  //       break;
  //     case 'hasError':
  //       count = data.filter(
  //         agreement =>
  //           agreement.status === AgreementStatus.expired ||
  //           agreement.status === AgreementStatus.conflicted ||
  //           agreement.status === AgreementStatus.breached ||
  //           agreement.status === AgreementStatus.fake
  //       ).map(f => Number(f.count)).reduce((a: number, b: number) => a + b, 0);
  //       break;
  //   }

  //   return count;
  // }

  // /**
  //  * Reorder By Tenant Agreements
  //  * @description order all agreements by a tenant and use
  //  * the slim properties
  //  */
  // private reorderByTenantAgreements(agreements: Agreement[]) {
  //   const tenants = agreements.map((agreement: Agreement) => {
  //     return this.reorderByTenantAgreement(agreement);
  //   });

  //   return tenants;
  // }

  // private reorderByTenantAgreement(agreement: Agreement) {
  //   const { property, tenant, paymentPlans } = agreement;
  //   const slimTenant = this.restrictContactDetails(tenant.fields());
  //   const slimAgreement = agreement.fieldsNoRelations();
  //   const assets = tenant.assets ? tenant.assets.map(asset => asset.fieldsNoRelations()) : [];
  //   if (paymentPlans.length > 1) {
  //     console.log(agreement)
  //   }

  //   return {
  //     ...slimTenant,
  //     property,
  //     agreement: slimAgreement,
  //     paymentPlan: paymentPlans.length > 0 ? paymentPlans[0] : [],
  //     assets
  //   }
  // }

  // private restrictContactDetails(tenant: Partial<Contact>) {
  //   const { contactDetails } = tenant;
  //   const filteredTenant = contactDetails?.filter(contactDetail => {
  //     return contactDetail.preferred;
  //   });

  //   return { ...tenant, contactDetails: filteredTenant };
  // }

  // private getPaymentsToReceiveFromPropertyGroups(propertyGroup: PropertyGroup) {
  //   const outstandingToReceive = propertyGroup.properties.flatMap(property => property.agreements)
  //     .flatMap(agreement => agreement.paymentPlans)
  //     .filter(paymentPlan => paymentPlan.payments.length > 0)
  //     .reduce((acc: number, curr) => { acc += Number(curr.outstandingAmount); return acc }, 0)

  //   const totalReceived = propertyGroup.properties.flatMap(property => property.agreements)
  //     .flatMap(agreement => agreement.paymentPlans)
  //     .filter(paymentPlan => paymentPlan.payments.length > 0)
  //     .flatMap(paymentPlan => paymentPlan.payments)
  //     .reduce((acc: number, curr) => { acc += Number(curr.amount); return acc }, 0)

  //   return { totalReceived, outstandingToReceive };
  // }

  // /**
  //  * Reconcile Tickets
  //  * @desc get the source type if a contact or user and join any tickets
  //  * collaborating on and included on
  //  */
  // private async reconcileTickets(tickets: TicketAPI[], ticketsCollaboratingOn: TicketCollaborator[]): Promise<Ticket[]> {
  //   const ticketsWithSourceInfo = await Promise.all(tickets.map(async (ticket: TicketAPI) => {
  //     const ticketSource = await this.getTicketSourceTypes(ticket);
  //     return ticketSource;
  //   }));

  //   const reorderdTicketsCollaboratingOn = await Promise.all(ticketsCollaboratingOn.map(async (ticketCollabrator: TicketCollaborator) => {
  //     const ticketSource = await this.getTicketSourceTypes(ticketCollabrator.ticket);
  //     return ticketSource;
  //   }));

  //   return [
  //     ...ticketsWithSourceInfo as unknown as Ticket[],
  //     ...reorderdTicketsCollaboratingOn as unknown as Ticket[]
  //   ];
  // }

  // private async getTicketSourceTypes(ticket: TicketAPI) {
  //   if (ticket.sourceType === SourceType.contact) {
  //     const contact = await Contact.findOne({
  //       where: {
  //         id: Number(ticket.sourceTypeId)
  //       }
  //     });
  //     ticket.sourceTypeContact = contact;
  //   }

  //   if (ticket.sourceType === SourceType.user) {
  //     const user = await User.findOne({
  //       where: {
  //         id: Number(ticket.sourceTypeId)
  //       }
  //     });
  //     ticket.sourceTypeUser = user;
  //   }

  //   return ticket;
  // }
}
