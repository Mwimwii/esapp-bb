import { controller, IAppController, Context, Get, HttpResponseOK } from '@foal/core';
import { createConnection } from 'typeorm';

import { ApiController } from 'src/app/controllers';
import { creds } from 'src/database'

export class AppController implements IAppController {
  subControllers = [
    controller('/api', ApiController),
  ];

  async init() {
    await createConnection(creds);
  }

  @Get('/health')
  health(_ctx: Context) {
    return new HttpResponseOK({
      app: 'titl'
    });
  }

}
