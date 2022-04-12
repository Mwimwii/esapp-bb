import {
  Context,
  HttpResponseOK,
  HttpResponseUnauthorized,
  Get,
  hashPassword,
  Post,
  ValidateBody,
} from '@foal/core';
import { JWTRequired } from '@foal/jwt';

import { RefreshJWT } from 'app/hooks';
import { User } from 'app/models';

const credentialsSchema = {
  additionalProperties: false,
  properties: {
    password: { type: 'string' },
  },
  required: [ 'password' ],
  type: 'object',
};

@JWTRequired({ cookie: true})
@RefreshJWT()
export class UserController {

  @Get('/current')
  async current(ctx: Context) {
    const { user } = ctx;
    const userWithJoins = await User.findOne({
      where: {
        id: user.id
      },
      relations: ['camp_officer'],
    });


    return new HttpResponseOK({
      id: user.id,
      email: user.email,
      camp_officerId: userWithJoins?.camp_officer?.id || null,
      firstName: userWithJoins?.camp_officer?.firstName || null,
      lastName: userWithJoins?.camp_officer?.lastName || null,
    });
  }

  @Get('/profile')
  async profile(ctx: Context) {
    const { user } = ctx;
    const userWithContact = await User.findOne({
      where: {
        id: user.id
      },
      relations: [
        'camp_officer',
      ],
    });

    return new HttpResponseOK(userWithContact?.fields());
  }

  @Post('/update-password')
  @ValidateBody(credentialsSchema)
  async updatePassword(ctx: Context) {
    const { user } = ctx;
    const { password } = ctx.request.body;

    const dbUser = await User.findOne({
      where: {
        id: user.id
      },
    });

    if (!dbUser) {
      return new HttpResponseUnauthorized();
    }

    dbUser.password = await hashPassword(password);

    await dbUser.save();

    const response = new HttpResponseOK(true);

    return response;
  }

}
