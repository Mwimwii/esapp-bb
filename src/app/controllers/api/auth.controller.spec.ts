// std
import { ok, strictEqual } from 'assert';

// 3p
import { Context, createController, getHttpMethod, getPath, HttpResponseUnauthorized } from '@foal/core';

// App
import { AuthController } from './auth.controller';

describe('AuthController', () => {

  let controller: AuthController;

  beforeEach(() => controller = createController(AuthController));

  describe('has a "login" method that', () => {

    it('should handle requests at POST /login.', () => {
      strictEqual(getHttpMethod(AuthController, 'login'), 'POST');
      strictEqual(getPath(AuthController, 'login'), '/login');
    });

    it('should return an HttpResponseUnauthorized.', () => {
      const ctx = new Context({});
      ok(new HttpResponseUnauthorized(controller.login(ctx)));
    });

  });

});
