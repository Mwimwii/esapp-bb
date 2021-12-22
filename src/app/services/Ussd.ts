import { UssdNodeType } from 'app/enums/UssdNodeType';
import { UssdNode } from 'app/models/UssdNode';
import { UssdRequest } from 'app/models/UssdRequest';

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

const propertyNodeSell = new UssdNode('Sell', UssdNodeType.list, [], 'Choose Property', propertyList);

const propertyNodeBuyout = new UssdNode('Buyout', UssdNodeType.list, [], 'Choose Property', propertyList);

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

export const rootNode = new UssdNode(
  'Welcome to TrueSoil.',
  UssdNodeType.nav,
  [
    englishNode,
    new UssdNode('Luganda', UssdNodeType.nav, []),
  ]
);
