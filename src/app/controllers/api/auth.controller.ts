import {
  Context,
  hashPassword,
  HttpResponseOK,
  HttpResponseUnauthorized,
  Post,
  ValidateBody,
  verifyPassword,
  dependency,
} from '@foal/core';
import { removeAuthCookie } from '@foal/jwt';

import { User } from 'app/models';
import { AuthService } from 'app/services';

const credentialsSchema = {
  additionalProperties: false,
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string' },
    phoneNumber: { type: 'number'},
  },
  required: [ 'password' ],
  type: 'object',
};

export class AuthController {
  @dependency
  authService: AuthService;

  /**
   * Signup
   * @description Take in an email or phoneNumber and sign up the user.
   * 1) If they have a phone number find the contact and assign that to the user
   * and set the email address as null
   * 2) If they have an email address, just assign the email address and set the
   * password
   * 3) Save the user and set the JWT token
   */
  @Post('/signup')
  @ValidateBody(credentialsSchema)
  async signup(ctx: Context) {
    const { email, password } = ctx.request.body;

    let user: User|undefined;
    if (email) {
      user = await User.findOne({
        where: {
          email,
        }
      });
    }

    // if (phoneNumber) {
    //   user = new User();

    //   const contact = await this.userContactRelationService.contactModelFromPhoneNumber(phoneNumber);

    //   if (contact) {
    //     user.contact = contact;
    //   }
    // }

    if (!user) {
      return new HttpResponseOK(false);
    }

    user.password = await hashPassword(password);

    await user.save();

    const response = new HttpResponseOK({
      id: user.id,
      email: user.email,
      camp_officerId: user.camp_officer?.id || null,
      firstName: user?.camp_officer?.firstName || null,
      lastName: user?.camp_officer?.lastName || null,
    });

    await this.authService.setCookie(user, response);

    return response;
  }

  @Post('/login')
  @ValidateBody(credentialsSchema)
  async login(ctx: Context) {
    const { email } = ctx.request.body;

    let user;
    if (email) {
      user = await User.findOne({
        relations: ['contact', 'administrator'],
        where: {
          email: ctx.request.body.email
        }
      });
    }
    // if (phoneNumber) {
    //   user = await this.userContactRelationService.userAndContactModelFromPhoneNumber(phoneNumber);
    // }

    if (!user) {
      return new HttpResponseUnauthorized();
    }

    if (!await verifyPassword(ctx.request.body.password, user.password)) {
      return new HttpResponseUnauthorized();
    }

    const response = new HttpResponseOK({
      id: user.id,
      email: user.email,
      camp_officerId: user.camp_officer?.id || null,
      firstName: user?.camp_officer?.firstName || null,
      lastName: user?.camp_officer?.lastName || null,
    });

    await this.authService.setCookie(user, response);

    user.lastLogin = new Date().toUTCString();
    user.save();

    return response;
  }

  @Post('/logout')
  async logout(_ctx: Context) {
    const response = new HttpResponseOK();
    removeAuthCookie(response);
    return response;
  }
}
