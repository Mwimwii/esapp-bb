import {
  Context,
  HttpResponseOK,
  Post,
  dependency,
} from '@foal/core';
import { ValidateMultipartFormDataBody } from '@foal/storage';
import { JWTRequired } from '@foal/jwt';
import { RefreshJWT } from 'app/hooks';

import {
  TenantService,
  PropertyService,
  AgreementService,
  PaymentService,
  FileService,
} from 'app/services';

@JWTRequired({ cookie: true})
@RefreshJWT()
export class OnboardingController {
  @dependency
  tenantService: TenantService;
  propertyService: PropertyService;
  agreementService: AgreementService;
  paymentService: PaymentService;
  fileService: FileService;

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

    const tenant = await this.tenantService.add(body.fields, body.files.tenantPicture, user);
    const property = this.propertyService.add(body.fields);
    const agreement = this.agreementService.add(
      body.fields,
      body.files.agreement,
      body.files.consentImageFront,
      body.files.consentImageBack,
      property,
      tenant
    );
    this.paymentService.add(body.fields, agreement);
    this.fileService.add(body.fields, body.files);

    return new HttpResponseOK({received: true});
  }
}
