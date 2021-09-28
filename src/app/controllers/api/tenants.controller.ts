import {
  Context,
  HttpResponseOK,
  Get,
  dependency,
} from '@foal/core';
import { JWTRequired } from '@foal/jwt';

import { Agreement } from 'app/models';
import { TenantsService } from 'app/services';

@JWTRequired({ cookie: true})
export class TenantsController {
  @dependency
  tenantsService: TenantsService;

  @Get('/all/:ownerId')
  async tenants(ctx: Context) {
    const { ownerId } = ctx.request.params;
    const agreements = await Agreement.find({
      relations: ['property', 'tenant'],
      where: {
        owner: ownerId
      }
    });

    const tenants = this.tenantsService.reorder(agreements);

    return new HttpResponseOK({
      tenants,
      count: tenants.length,
    });
  }
}
