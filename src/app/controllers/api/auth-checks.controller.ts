import {
  Context,
  Post,
  ValidateBody,
  HttpResponseOK,
} from '@foal/core';
import { getConnection } from 'typeorm';

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

    return new HttpResponseOK(Boolean(user));
  }

  @Post('/contact-exists')
  @ValidateBody(contactExistsSchema)
  async contactExists(ctx: Context) {
    const connection = getConnection();

    const { firstName, lastName, phoneNumber } = ctx.request.body;

    const contact = await connection.createQueryBuilder()
      .select('contact.uuid')
      .from(Contact, 'contact')
      .innerJoin('contact.contactDetails', 'contactDetail')
      .where('contact.firstName = :firstName', { firstName })
      .where('contact.lastName = :lastName', { lastName })
      .where('contactDetail.contactDetailType = :type', { type: ContactDetailType.phone })
      .where('contactDetail.contactDetailValue = :value', { value: phoneNumber })
      .getOne();

    if (contact) {
      return new HttpResponseOK(contact.uuid);
    }

    return new HttpResponseOK(false);
  }

}

