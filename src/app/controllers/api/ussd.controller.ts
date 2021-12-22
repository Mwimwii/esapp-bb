import {
  Context,
  HttpResponseOK,
  Post,
} from '@foal/core';
import { UssdNode } from '../../models/UssdNode';
import { UssdNodeType } from '../../enums/UssdNodeType';
import { UssdRequest } from 'app/models/UssdRequest';
import { rootNode } from 'app/services/Ussd';

// import { LandOwnersService } from 'app/services';

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

    const result = this.executeUssdSequence(rootNode, sequence, ussdRequest);
    console.log(result);

    return new HttpResponseOK(result);
  }

  executeUssdSequence(startNode: UssdNode, sequence: string[], request: UssdRequest) {
    console.log(sequence);
    let currentNode = startNode;

    do {
      const nextSequenceVal = sequence.shift();
      const nextInt = +(nextSequenceVal || 0);

      if (nextInt >= 0 && nextInt <= currentNode.branches.length) {
        currentNode = currentNode.getNext(nextInt);
        currentNode.executeCalldata(request, nextSequenceVal);
        if (currentNode.type == UssdNodeType.detail) {
          currentNode.datalist = [currentNode.datalist[+(nextSequenceVal || 1) - 1]];
        }
      } else {
        currentNode = currentNode.executeCallback(request, nextSequenceVal);
      }
    } while (sequence.length > 0);
    console.log(currentNode);
    return currentNode.execute();
  }
}