import { ApiInfo, ApiServer, Context, controller, Get, HttpResponseOK, UseSessions } from '@foal/core';
import { fetchUser } from '@foal/typeorm';
import { User } from 'app/models';
import { JWTRequired } from '@foal/jwt';
import { AuthController, AuthChecksController } from './api';

@ApiInfo({
  title: 'Application API',
  version: '1.0.0'
})
@ApiServer({
  url: '/api'
})
@UseSessions({
  cookie: true,
  user: fetchUser(User),
})
export class ApiController {
  subControllers = [
    controller('/auth', AuthController),
    controller('/auth-checks', AuthChecksController)
  ];


  @JWTRequired({ cookie: true})
  @Get('/')
  index(_ctx: Context) {
    return new HttpResponseOK({
      api: 'titl'
    });
  }

}
