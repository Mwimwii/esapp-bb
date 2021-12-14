import {
  Context,
  HttpResponseOK,
  Post,
  Get,
  Put,
  dependency,
} from '@foal/core';
import { ValidateMultipartFormDataBody } from '@foal/storage';
import { JWTRequired } from '@foal/jwt';
import { RefreshJWT } from 'app/hooks';

import {
  TicketService,
  FileService,
} from 'app/services';

@JWTRequired({ cookie: true})
@RefreshJWT()
export class TicketController {
  @dependency
  ticketService: TicketService;
  @dependency
  fileService: FileService;

  @Get('/')
  async all(ctx: Context) {
    const { user } = ctx;
    const tickets = await this.ticketService.getAll(user);

    return new HttpResponseOK(tickets);
  }

  @Get('/ticket/:ticketUuId')
  async get(ctx: Context) {
    const { ticketUuid } = ctx.request.params;
    const { user } = ctx;

    const ticket = this.ticketService.get(user, ticketUuid);

    return new HttpResponseOK(ticket);
  }

  @Post('/create')
  @ValidateMultipartFormDataBody({
    files: {
      image: { required: false, },
    }
  })
  async create(ctx: Context) {
    const { user } = ctx;
    const body = ctx.request.body;
    this.ticketService.create(body.fields, body.files.image, user);

    return new HttpResponseOK({received: true});
  }

  @Put('/update/:ticketUuId')
  @ValidateMultipartFormDataBody({
    files: {
      image: { required: false, },
    }
  })
  async update(ctx: Context) {
    const { ticketUuid } = ctx.request.params;
    const { user } = ctx;
    const body = ctx.request.body;

    this.ticketService.update(ticketUuid, body.fields, body.files.image, user);

    return new HttpResponseOK({received: true});
  }
}

