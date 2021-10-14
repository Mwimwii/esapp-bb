import {
  Hook,
  HookDecorator,
  HttpResponse,
  isHttpResponseServerError,
} from '@foal/core';

import { AuthService } from 'app/services';

export function RefreshJWT(): HookDecorator {
  return Hook(ctx => {
    if (!ctx.user) {
      return;
    }

    const authService = new AuthService();

    return (response: HttpResponse) => {
      if (isHttpResponseServerError(response)) {
        return;
      }

      authService.setCookie(ctx.user, response);
    };
  });
}
