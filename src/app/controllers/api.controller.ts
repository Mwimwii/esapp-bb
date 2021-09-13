import { Context, Get, HttpResponseOK } from '@foal/core';

export class ApiController {

  @Get('/')
  index(_ctx: Context) {
    return new HttpResponseOK('Hello world!');
  }

}
