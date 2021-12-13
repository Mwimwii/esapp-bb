import {
  Context,
  HttpResponseOK,
  Post,
} from '@foal/core';
import { UssdNode } from '../../models/UssdNode';
import { UssdNodeType } from '../../enums/UssdNodeType';
import { UssdRequest } from 'app/models/UssdRequest';

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
      let nextSequenceVal = sequence.shift();
      let nextInt = +(nextSequenceVal || 0);
      if (currentNode.type == UssdNodeType.list) {
        currentNode.executeCalldata(request, nextSequenceVal);
        currentNode.buildListNodes();
      }
      if (nextInt >= 0 && nextInt <= currentNode.branches.length) {
        currentNode = currentNode.getNext(nextInt);
      } else {
        currentNode = currentNode.executeCallback(request, nextSequenceVal);
      }
    } while (sequence.length > 0);
    console.log(currentNode);
    return currentNode.execute();
  }
}

const propertyList = [
  {
    id: 133,
    title: 'Migalu Rd plot 1289',
    tenancy_start: '20/12/2012',
    payments: 200000,
    frequency: 'Monthly',
    payment_due: '20/12/2012',
    paid_until: '20/12/2012',
    due_date: '20/12/2012',
  },
  {
    id: 122,
    title: 'Property 2',
    tenancy_start: '20/12/2012',
    payments: 1500000,
    frequency: 'Weekly',
    payment_due: '20/12/2012',
    paid_until: '20/12/2012',
    due_date: '20/12/2012',
  },
  {
    id: 312,
    title: 'Daily Property',
    tenancy_start: '20/12/2012',
    payments: 20000,
    frequency: 'Daily',
    payment_due: '20/12/2012',
    paid_until: '20/12/2012',
    due_date: '20/12/2012',
  }
]

function paymentsPropertyList(request: UssdRequest, params: any, data: any) {
  console.log(request, params, data);
  return propertyList;
}

function payNodeCallBack(request: UssdRequest, params: any) {
  console.log({ request, params });
}

const endNode = new UssdNode('Cancel', UssdNodeType.end, [], 'Thank you for using TrueSoil');
const payNode = new UssdNode('Pay', UssdNodeType.prompt, [endNode], 'Enter UGX Amount:', payNodeCallBack);

const propertyNodePayments = new UssdNode('Payments', UssdNodeType.list, [
  payNode,
  endNode
], 'Choose Property', paymentsPropertyList);

const propertyNodeSell = new UssdNode('Sell', UssdNodeType.list, [

], 'Choose Property', propertyList);

const propertyNodeBuyout = new UssdNode('Buyout', UssdNodeType.list, [

], 'Choose Property', propertyList);

const requestNodeList = new UssdNode('Check Requests', UssdNodeType.nav, [
  new UssdNode('Requests', UssdNodeType.list, [], '', [
    'Land Sell',
    'Land Purchase',
    'Buyout'
  ]), // Add datalist
], 'Choose Request');

const contactNode = new UssdNode('Contact Truesoil', UssdNodeType.nav, [
  new UssdNode('Request us to Call You', UssdNodeType.nav, []),
  new UssdNode('Call TrueSoil', UssdNodeType.nav, []),
])

const englishNode = new UssdNode('English', UssdNodeType.nav, [
  propertyNodePayments,
  requestNodeList,
  contactNode,
  propertyNodeSell,
  propertyNodeBuyout,
], 'What do you want to do?')

const rootNode = new UssdNode(
  'Welcome to TrueSoil.',
  UssdNodeType.nav,
  [
    englishNode,
    new UssdNode('Luganda', UssdNodeType.nav, []),
  ]
);