import {
  Context,
  Post,
  ValidateBody,
  HttpResponseOK,
  dependency,
} from '@foal/core';

import { User } from 'app/models';
import { UserContactRelationService } from 'app/services';

const userExistsSchema = {
  additionalProperties: false,
  properties: {
    email: { type: 'string', format: 'email'}
  },
  required: [ 'email' ],
  type: 'object'
}

const contactExistsSchema = {
  additionalProperties: false,
  properties: {
    phoneNumber: { type: 'number'},
  },
  required: [ 'phoneNumber' ],
  type: 'object'
}

export class AuthChecksController {
  @dependency
  userContactRelationService: UserContactRelationService;

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

  @Post('/contact-exists')
  @ValidateBody(contactExistsSchema)
  async contactExists(ctx: Context) {
    const { phoneNumber } = ctx.request.body;

    const {
      contactid,
      userpassword,
      userid
    } = await this.userContactRelationService.detailsFromPhoneNumber(phoneNumber);

    if (contactid) {
      return new HttpResponseOK({ isContact: true, isUser: Boolean(userid), hasPassword: Boolean(userpassword) });
    }

    return new HttpResponseOK({ isContact: false, isUser: false, hasPassword: false });
  }

}

