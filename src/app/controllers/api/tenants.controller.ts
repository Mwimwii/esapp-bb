import {
  Context,
  HttpResponseOK,
  Post,
  ValidateBody,
} from '@foal/core';
import { JWTRequired } from '@foal/jwt';

import { Agreement } from 'app/models';

const tenantsSchema = {
  additionalProperties: false,
  properties: {
    ownerId: { type: 'number'}
  },
  required: ['ownerId'],
  type: 'object'
};

export class TenantsController {

  @Post('/all')
  @ValidateBody(tenantsSchema)
  @JWTRequired({ cookie: true})
  async tenants(ctx: Context) {
    const { ownerId } = ctx.request.body;

    const tenants = await Agreement.find({
      relations: ['property', 'tenant'],
      where: {
        owner: ownerId
      }
    });

    return new HttpResponseOK({
      tenants,
    });
  }
}
