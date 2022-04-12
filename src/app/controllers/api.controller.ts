import { ApiInfo, ApiServer, controller, UseSessions } from '@foal/core';
import { fetchUser } from '@foal/typeorm';
import { User } from 'app/models';
import {
  AuthController,
  AuthChecksController,
  UserController,
  FaabsController,
  FarmersController,
  MarketController,
} from './api';

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
    controller('/auth-checks', AuthChecksController),
    controller('/faabs', FaabsController),
    controller('/farmers', FarmersController),
    controller('/market', MarketController),
    controller('/user', UserController),
  ];
}
