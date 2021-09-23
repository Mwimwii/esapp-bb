import { ApiInfo, ApiServer, controller, UseSessions } from '@foal/core';
import { fetchUser } from '@foal/typeorm';
import { User } from 'app/models';
import {
  AuthController,
  AuthChecksController,
  TenantsController,
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
    controller('/tenants', TenantsController)
  ];
}
