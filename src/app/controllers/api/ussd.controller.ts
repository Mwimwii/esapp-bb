import {
  Context,
  HttpResponseOK,
  Post,
} from '@foal/core';
import { UssdNode } from '../../models/UssdNode';
import { UssdNodeType } from '../../enums/UssdNodeType';
import { UssdRequest } from 'app/models/UssdRequest';

// import { LandOwnersService } from 'app/services';

const propertyList = [
  {
    id: 133,
    title: 'Migalu Rd plot 1289',
    TenancyStart: '20/12/2012',
    Payments: 200000,
    Frequency: 'Monthly',
    PaymentDue: '20/12/2012',
    PaidUntil: '20/12/2012',
    DueDate: '20/12/2012',
  },
  {
    id: 122,
    title: 'Property 2',
    TenancyStart: '20/12/2012',
    Payments: 1500000,
    Frequency: 'Weekly',
    PaymentDue: '20/12/2012',
    PaidUntil: '20/12/2012',
    DueDate: '20/12/2012',
  },
  {
    id: 312,
    title: 'Daily Property',
    TenancyStart: '20/12/2012',
    Payments: 20000,
    Frequency: 'Daily',
    PaymentDue: '20/12/2012',
    PaidUntil: '20/12/2012',
    DueDate: '20/12/2012',
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