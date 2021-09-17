import {
  Context,
  Post,
  ValidateBody,
  HttpResponseOK,
} from '@foal/core';

import { User, Contact } from 'app/models';
import { ContactDetailType } from 'app/enums/ContactDetailType';

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
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    phoneNumber: { type: 'number'},
  },
  required: [ 'firstName', 'lastName', 'phoneNumber' ],
  type: 'object'
}

export class AuthChecksController {

  @Post('/user-exists')
  @ValidateBody(userExistsSchema)
  async userExists(ctx: Context) {
    const user = await User.findOne({ email: ctx.request.body.email });

    //return new HttpResponseOK({ exists: Boolean(user) });
    return new HttpResponseOK(Boolean(user));
  }

  @Post('/contact-exists')
  @ValidateBody(contactExistsSchema)
  async contactExists(ctx: Context) {
    const contact = await Contact.find({
      relations: ['contact_detail'],
      where: {
        firstName: ctx.request.body.firstName,
        lastName: ctx.request.body.lastName,
        contactDetailValue: ctx.request.body.phoneNumber,
        contactDetailType: ContactDetailType.email,
      },
      take: 1,
    })

    return new HttpResponseOK(Boolean(contact));
  }

}

