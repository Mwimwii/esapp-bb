import {
  Context,
  HttpResponseOK,
  Post,
  Get,
  dependency,
} from '@foal/core';
// import { ValidateMultipartFormDataBody } from '@foal/storage';
// import { JWTRequired } from '@foal/jwt';
// import { RefreshJWT } from 'app/hooks';

import { MarketService } from 'app/services';

// import {
//   TicketService,
//   FileService,
// } from 'app/services';

// @JWTRequired({ cookie: true})
// @RefreshJWT()
export class MarketController {
  @dependency
  marketService: MarketService;
  // @dependency
  // fileService: FileService;

  @Post('/submit')
  async add(ctx: Context) {
    const body = ctx.request.body;
    const market = await this.marketService.add(body);

    return new HttpResponseOK(market);
  }
  @Get('/')
  async getAll() {
    const market = await this.marketService.getAll();
    return new HttpResponseOK(market);
  }

  // @Put('/update/:ticketUuId')
  // @ValidateMultipartFormDataBody({
  //   files: {
  //     image: { required: false, },
  //   }
  // })
  // async update(ctx: Context) {
  //   const { ticketUuid } = ctx.request.params;
  //   const { user } = ctx;
  //   const body = ctx.request.body;

  //   this.ticketService.update(ticketUuid, body.fields, body.files.image, user);

  //   return new HttpResponseOK({received: true});
  // }
}

