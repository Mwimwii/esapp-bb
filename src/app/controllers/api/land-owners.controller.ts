import {
  Context,
  HttpResponseOK,
  Get,
  dependency,
} from '@foal/core';
import { JWTRequired } from '@foal/jwt';
import { RefreshJWT } from 'app/hooks';

import { LandOwnersService } from 'app/services';

@JWTRequired({ cookie: true})
@RefreshJWT()
export class LandOwnersController {
  @dependency
  landOwnersService: LandOwnersService;

  @Get('/:ownerId/overview')
  async getLandOwnerOverview(ctx: Context) {
    const { ownerId } = ctx.request.params;
    const overview = await this.landOwnersService.overview(ownerId);

    return new HttpResponseOK({
      overview
    });
  }

  @Get('/:ownerId/tenants')
  async getTenantsByLandOwner(ctx: Context) {
    const { ownerId } = ctx.request.params;
    const tenants = await this.landOwnersService.allTenantsWithRentPaymentPlans(ownerId);

    return new HttpResponseOK({
      tenants,
      count: tenants.length,
    });
  }

  @Get('/:ownerId/tenant/:tenantUuid')
  async getTenantByLandowner(ctx: Context) {
    const { ownerId, tenantUuid } = ctx.request.params;
    const tenant = await this.landOwnersService.getTenantAndPaymentPlan(tenantUuid, ownerId);

    return new HttpResponseOK({
      tenant
    });
  }
}
