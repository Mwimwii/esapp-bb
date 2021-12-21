import { ApiInfo, ApiServer, controller, UseSessions } from '@foal/core';
import { fetchUser } from '@foal/typeorm';
import { User } from 'app/models';
import {
  AuthController,
  AuthChecksController,
  UserController,
  LandOwnersController,
<<<<<<< HEAD
  UssdController
=======
  OnboardingController,
  TicketController,
>>>>>>> dev
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
    controller('/land-owners', LandOwnersController),
    controller('/user', UserController),
    controller('/ussd', UssdController),
    controller('/onboarding', OnboardingController),
    controller('/tickets', TicketController),
  ];
}
