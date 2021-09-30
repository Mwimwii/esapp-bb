import {
  Context,
  HttpResponseOK,
  Get,
  dependency,
} from '@foal/core';
import { JWTRequired } from '@foal/jwt';

import { TenantsService } from 'app/services';

@JWTRequired({ cookie: true})
export class TenantsController {
  @dependency
  tenantsService: TenantsService;

  @Get('/:ownerId')
  async tenants(ctx: Context) {
    const { ownerId } = ctx.request.params;
    const tenants = await this.tenantsService.allTenantsByOwner(ownerId);

    return new HttpResponseOK({
      tenants,
      count: tenants.length,
    });
  }
}
