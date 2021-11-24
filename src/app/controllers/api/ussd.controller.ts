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

    const ussdRequest = ctx.request.body;
    console.log(ussdRequest);
    const sequence = ussdRequest.text.split('*');
    console.log(sequence);
    ctx.session?.set('ussdRequest', ussdRequest);
    const result = ProcessUssd(sequence);

    return new HttpResponseOK(result);
  }
}

function ProcessUssd(sequence: string[]) {
  let output = 'CON ';
  do {
    output += `${sequence.shift()} Completed \n`;
    console.log(output);
  } while (sequence.length > 0);
  return output;
}

