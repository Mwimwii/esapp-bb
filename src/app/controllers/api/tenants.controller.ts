import {
  Context,
  HttpResponseOK,
  Post,
  ValidateBody,
  dependency,
} from '@foal/core';
import { JWTRequired } from '@foal/jwt';

import { Agreement } from 'app/models';
import { TenantsService } from 'app/services';

const tenantsSchema = {
  additionalProperties: false,
  properties: {
    ownerId: { type: 'number'}
  },
  required: ['ownerId'],
  type: 'object'
};

@JWTRequired({ cookie: true})
export class TenantsController {
  @dependency
  tenantsService: TenantsService;

  @Post('/all')
  @ValidateBody(tenantsSchema)
  async tenants(ctx: Context) {
    const { ownerId } = ctx.request.body;

    const agreements = await Agreement.find({
      relations: ['property', 'tenant'],
      where: {
        owner: ownerId
      }
    });

    const tenants = this.tenantsService.reorder(agreements);

    return new HttpResponseOK({
      tenants,
    });
  }
}
