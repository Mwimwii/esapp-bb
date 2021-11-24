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

class UssdNode {
  /**
   *
   */
  constructor(title: string, branches: UssdNode[]) {
    this.title = title;
    this.branches = branches;
  }
  title: string;
  branches: UssdNode[];
  getText = (): string => {
    if (this.branches.length > 0) {
      let text = 'CON ';
      for (let index = 0; index < this.branches.length; index++) {
        text += `${index + 1}. ${this.branches[index].title}\n`;
      }
      return text;
    }
    else {
      return 'END ' + this.title;
    }
  }
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
  console.log(sequence);
  let rootNodes = new UssdNode(
    'Choose Language',
    [
      <UssdNode>({
        title: 'English',
      }),
      <UssdNode>({
        title: 'Luganda',
      })
    ]
  );

  do {
    // output += `${sequence.shift()} Completed \n`;
    console.log(output);
  } while (sequence.length > 0);
  const x = navNodes.getText;
  return rootNodes.getText();
}

