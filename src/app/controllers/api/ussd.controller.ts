import {
  Context,
  HttpResponseOK,
  Post,
} from '@foal/core';

// import { LandOwnersService } from 'app/services';

export class UssdRequest {
  phoneNumber: string;
  serviceCode: string;
  text: string;
  sessionId: string;
  networkCode: string;
}

export class UssdResponse {

}
export class UssdController {
  // @dependency
  // landOwnersService: LandOwnersService;

  @Post('/')
  // @ValidateBody(UssdRequest)
  async processUssdRequest(ctx: Context) {

    console.log(ctx.request.body);
    const result = ProcessUssd(ctx.request.body);

    return new HttpResponseOK('CON 1. Continue 2. Stop');
  }
}

function ProcessUssd(ussdRequest: UssdRequest) {
  console.log(ussdRequest);
}

