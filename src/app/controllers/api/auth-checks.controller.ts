import {
  Context,
  Post,
  ValidateBody,
  HttpResponseOK,
} from '@foal/core';

import { User } from 'app/models';

const userExistsSchema = {
  additionalProperties: false,
  properties: {
    email: { type: 'string', format: 'email'}
  },
  required: [ 'email' ],
  type: 'object'
}

export class AuthChecksController {
  @Post('/user-exists')
  @ValidateBody(userExistsSchema)
  async userExists(ctx: Context) {
    const user = await User.findOne({ email: ctx.request.body.email });
    if (!user) {
      return new HttpResponseOK({ isUser: false, hasPassword: false });
    }
    const hasPassword = user?.password !== null;

    return new HttpResponseOK({ isUser: true, hasPassword });
  }


}

