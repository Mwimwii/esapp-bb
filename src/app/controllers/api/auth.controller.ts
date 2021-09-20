import {
  Context,
  hashPassword,
  HttpResponseOK,
  HttpResponseUnauthorized,
  Post,
  ValidateBody,
  verifyPassword,
  Env,
} from '@foal/core';

import { getSecretOrPrivateKey, removeAuthCookie, setAuthCookie } from '@foal/jwt';
import { sign } from 'jsonwebtoken';
import { promisify } from 'util';

import { User, Contact } from 'app/models';

const credentialsSchema = {
  additionalProperties: false,
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string' },
    uuid: { type: 'string'},
  },
  required: [ 'email', 'password' ],
  type: 'object',
};

export class AuthController {

  @Post('/signup')
  @ValidateBody(credentialsSchema)
  async signup(ctx: Context) {
    const { email, password, uuid } = ctx.request.body;
    const user = new User();
    user.email = email;
    user.password = await hashPassword(password);

    if (uuid) {
      const contactId = await Contact.findOne({ uuid });
      if (contactId) {
        user.contact = contactId;
      }
    }

    await user.save();

    const response = new HttpResponseOK();
    await setAuthCookie(response, await this.createJWT(user));

    return response;
  }

  @Post('/login')
  @ValidateBody(credentialsSchema)
  async login(ctx: Context) {
    const user = await User.findOne({ email: ctx.request.body.email });

    if (!user) {
      return new HttpResponseUnauthorized();
    }

    if (!await verifyPassword(ctx.request.body.password, user.password)) {
      return new HttpResponseUnauthorized();
    }

    const response = new HttpResponseOK({
      id: user.id,
      email: user.email,
    });

    const token = await this.createJWT(user);
    await setAuthCookie(response, token);

    return response;
  }

  @Post('/logout')
  async logout(_ctx: Context) {
    const response = new HttpResponseOK();
    removeAuthCookie(response);
    return response;
  }

  private async createJWT(user: User): Promise<string> {
    const payload = {
      email: user.email,
      id: user.id,
    };

    const expiresIn = Env.get('JWT_COOKIE_LENGTH') || '1h';

    return promisify(sign as any)(
      payload,
      getSecretOrPrivateKey(),
      { expiresIn, subject: user.id.toString() }
    );
  }
}
