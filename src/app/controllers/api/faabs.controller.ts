import {
  // Context,
  HttpResponseOK,
  // Get,
  dependency, Get, Context, Post,
} from '@foal/core';
// import { JWTRequired } from '@foal/jwt';
// import { RefreshJWT } from 'app/hooks';

import { FaabsService } from 'app/services';

// @JWTRequired({ cookie: true})
// @RefreshJWT()
export class FaabsController {
  @dependency
  faabsService: FaabsService;

  @Get('/:campId')
  async getAll(ctx: Context) {
      const { campId } = ctx.request.params;
      const faabs = await this.faabsService.allFaabsGroups(campId);
      return new HttpResponseOK(faabs);
    }

  @Get('/topics/all')
  async getTopics() {
      const faabsTopics = await this.faabsService.allFaabsTopics();
      return new HttpResponseOK(faabsTopics);
    }


    @Post('/:faabsId/attendance/submit')
    async submitAttendace(ctx: Context) {
      const body = ctx.request.body;
      const { faabsId } = ctx.request.params;
      console.log(body)
      const faabsAttendance = await this.faabsService.addAttendance({...body, faabsGroup: faabsId});
      return new HttpResponseOK({ faabs: faabsAttendance });
    }

  @Post('/submit')
  async submit(ctx: Context) {
    const body = ctx.request.body;
    console.log(body)
    const faabs = await this.faabsService.add(body);
    return new HttpResponseOK({ faabs });
  }
  // @Get('/:campId')
  // async getAll(ctx: Context) {
  //   const { user } = ctx;
  //   const { ownerId } = ctx.request.params;
  //   const overview = await this.landOwnersService.overview(ownerId);

  //   return new HttpResponseOK(overview);
  // }

  // @Get('/:ownerId/tenants')
  // async getTenants(ctx: Context) {
  //   const { ownerId } = ctx.request.params;
  //   const tenants = await this.landOwnersService.allTenantsByOwnerId(ownerId);

  //   return new HttpResponseOK({
  //     tenants,
  //     count: tenants.length,
  //   });
  // }

  // @Get('/:ownerId/tenant/:tenantUuid')
  // async getTenant(ctx: Context) {
  //   const { ownerId, tenantUuid } = ctx.request.params;
  //   const tenant = await this.landOwnersService.getTenantAndPaymentPlan(tenantUuid, ownerId);

  //   return new HttpResponseOK({
  //     tenant
  //   });
  // }

  // @Get('/:ownerId/properties')
  // async getProperties(ctx: Context) {
  //   const { ownerId } = ctx.request.params;
  //   const properties = await this.landOwnersService.getProperties(ownerId);

  //   return new HttpResponseOK(properties);
  // }

  // @Get('/:ownerId/property/:propertyUuid')
  // async getProperty(ctx: Context) {
  //   const { ownerId, propertyUuid } = ctx.request.params;
  //   const propertyGroup = await this.landOwnersService.getProperty(propertyUuid, ownerId);

  //   return new HttpResponseOK({
  //     propertyGroup
  //   });
  // }

  // @Get('/:ownerId/payments')
  // async getPayments(ctx: Context) {
  //   const { ownerId } = ctx.request.params;
  //   const payments = await this.landOwnersService.getPayments(ownerId);

  //   return new HttpResponseOK(payments);
  // }

  // @Get('/:ownerId/tickets')
  // async getTickets(ctx: Context) {
  //   const { user } = ctx;

  //   const tickets = await this.landOwnersService.allTicketsByTenant(user.id);

  //   return new HttpResponseOK(tickets);
  // }

  // @Get('/:ownerId/ticket/:ticketUuid')
  // async getTicket(ctx: Context) {
  //   const { user } = ctx;
  //   const { ticketUuid } = ctx.request.params;

  //   const ticket = await this.landOwnersService.getTicket(user.id, ticketUuid);

  //   return new HttpResponseOK(ticket);
  // }
}
