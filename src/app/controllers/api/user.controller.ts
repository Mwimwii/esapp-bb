import {
  Context,
  HttpResponseOK,
  Get,
} from '@foal/core';
import { JWTRequired } from '@foal/jwt';

import { User } from 'app/models';

@JWTRequired({ cookie: true})
export class UserController {

  @Get('/current')
  async current(ctx: Context) {
    const { user } = ctx;
    const userWithContact = await User.findOne({
      where: {
        id: user.id
      },
      relations: ['contact'],
    });


    return new HttpResponseOK({
      id: user.id,
      email: user.email,
      contactId: userWithContact?.contact?.id || null,
      firstName: userWithContact?.contact?.firstName || null,
      lastName: userWithContact?.contact?.lastName || null,
    });
  }

  @Get('/profile')
  async profile(ctx: Context) {
    const { user } = ctx;
    const userWithContact = await User.findOne({
      where: {
        id: user.id
      },
      relations: ['contact', 'contact.contactDetails'],
    });

    return new HttpResponseOK(userWithContact?.fields());
  }
}
