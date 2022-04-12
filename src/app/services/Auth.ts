import { Env, HttpResponse } from '@foal/core';
import { sign } from 'jsonwebtoken';
import { promisify } from 'util';
import { getSecretOrPrivateKey, setAuthCookie } from '@foal/jwt';

import { User } from 'app/models';

export class AuthService {

  async setCookie(user: User, response: HttpResponse): Promise<void> {
    const token = await this.createJWT(user);
    await setAuthCookie(response, token);
  }

  /**
   * Create JWT
   * @description create a JWT token with a specific
   * expiry time
   */
  private async createJWT(user: User): Promise<string> {
    const payload = {
      email: user.email,
      id: user.id,
      camp_officerId: user.camp_officer?.id ?? null,
    };

    const expiresIn = Env.get('JWT_COOKIE_LENGTH') || '1h';

    return promisify(sign as any)(
      payload,
      getSecretOrPrivateKey(),
      { expiresIn, subject: user.id.toString() }
    );
  }
}

