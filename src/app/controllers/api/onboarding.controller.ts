import {
  Context,
  HttpResponseOK,
  Post,
  dependency,
} from '@foal/core';
import { ValidateMultipartFormDataBody } from '@foal/storage';
import { JWTRequired } from '@foal/jwt';
import { RefreshJWT } from 'app/hooks';

import { TenantService } from 'app/services';

@JWTRequired({ cookie: true})
@RefreshJWT()
export class OnboardingController {
  @dependency
  tenantService: TenantService;

  @Post('/submit')
  @ValidateMultipartFormDataBody({
    files: {
      identificationImageFront: { required: false, },
      identificationImageBack: { required: false, },
      tenantPicture: { required: false, },
      agreement: { required: false, },
      consentImageFront: { required: false, },
      consentImageBack: { required: false, },
    }
  })
  async submit(ctx: Context) {
    const { user } = ctx;
    const body = ctx.request.body;
    this.tenantService.add(body.fields, body.files.tenantPicture, user);

    return new HttpResponseOK({received: true});
  }
}
