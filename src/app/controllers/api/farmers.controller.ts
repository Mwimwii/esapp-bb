import {
  Context,
  HttpResponseOK,
  Post,
  dependency,
  Get,
} from '@foal/core';
import { FarmerService } from 'app/services';
// import { JWTRequired } from '@foal/jwt';
// import { RefreshJWT } from 'app/hooks';


// @JWTRequired({ cookie: true})
// @RefreshJWT()
export class FarmersController {
  @dependency
  farmerService: FarmerService;

  @Get('/')
  async get() {
    const farmers = await this.farmerService.getAll();
    return new HttpResponseOK({ farmers });
  }

  @Post('/submit')
  async submit(ctx: Context) {
    const body = ctx.request.body;
    console.log(body)
    const farmer = await this.farmerService.add(body);
    return new HttpResponseOK({ farmer });
  }



}
