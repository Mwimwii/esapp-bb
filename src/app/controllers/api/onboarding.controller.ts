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
  IdentificationService,
} from 'app/services';

@JWTRequired({ cookie: true})
@RefreshJWT()
export class OnboardingController {
  @dependency
  tenantService: TenantService;
  @dependency
  propertyService: PropertyService;
  @dependency
  agreementService: AgreementService;
  @dependency
  paymentService: PaymentService;
  @dependency
  fileService: FileService;
  @dependency
  identificationService: IdentificationService;

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
    const property = await this.propertyService.add(body.fields, user);
    const agreement = await this.agreementService.add(
      body.fields,
      body.files.agreement,
      body.files.consentImageFront,
      body.files.consentImageBack,
      property,
      tenant,
      user,
    );
    await this.identificationService.add(body.fields, body.files, tenant, user);
    await this.paymentService.add(body.fields, agreement, user);
    await this.fileService.add(body.fields, body.files, tenant, user);

    return new HttpResponseOK({received: true});
  }
}
