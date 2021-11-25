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
  execute = (): string => {
    if (this.branches.length > 0) {
      let text = 'CON ' + this.title + '\n';
      for (let index = 0; index < this.branches.length; index++) {
        text += `${index + 1}. ${this.branches[index].title}\n`;
      }
      return text;
    }
    else {
      return 'END ' + this.title;
    }
  }

  getNext = (sequenceid: number): UssdNode => {
    if (sequenceid > 0) {
      return this.branches[sequenceid - 1];
    }
    return this;
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
    const result = executeUssdSequence(rootNode, sequence);
    console.log(result);

    return new HttpResponseOK(result);
  }
}

function executeUssdSequence(startNode: UssdNode, sequence: string[]) {
  console.log(sequence);
  let currentNode = startNode;

  do {
    const nextInt = +(sequence.shift() || 0);
    if (nextInt > 0) {
      currentNode = currentNode.getNext(nextInt);
    }
  } while (sequence.length > 0);

  return currentNode.execute();
}

const rootNode =
  new UssdNode(
    'Welcome to TrueSoil.',
    [
      new UssdNode('English', []),
      new UssdNode('Luganda', []),
    ]
  );