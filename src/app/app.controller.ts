import { controller, IAppController, Context, Get, HttpResponseOK } from '@foal/core';
import { createConnection } from 'typeorm';

import { ApiController } from 'app/controllers';

export class AppController implements IAppController {
  subControllers = [
    controller('/api', ApiController),
  ];

  async init() {
    await createConnection();
  }

  @Get('/health')
  health(_ctx: Context) {
    return new HttpResponseOK({
      app: 'titl'
    });
  }

}
