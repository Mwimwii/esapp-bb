import { UssdNodeType } from 'app/enums/UssdNodeType';
import { UssdNode } from 'app/models/UssdNode';
import { UssdRequest } from 'app/models/UssdRequest';


const requestList = [
  {
    id: 133,
    title: 'Sell Najjera House',
    property: 'Najjera House',
    request: 'Sell',
    status: 'Waiting reply',
    dueDate: '20/12/2012',
  },
  {
    id: 11,
    title: 'Buyout Land Mukono',
    property: 'Land Mukono',
    request: 'Buyout',
    status: 'Approved',
    dueDate: '20/12/2012',
  },
];

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
];

function paymentsRequestsList(request: UssdRequest, params: any, data: any) {
  console.log(request, params, data);
  return requestList;
}

function paymentsPropertyList(request: UssdRequest, params: any, data: any) {
  console.log(request, params, data);
  return propertyList;
}

function buyPropertyList(request: UssdRequest, params: any, data: any) {
  console.log(request, params, data);
  return propertyList;
}

function payNodeCallBack(request: UssdRequest, params: any) {
  console.log({ request, params });
}

function sellNodeCallBack(request: UssdRequest, params: any) {
  console.log({ request, params });
}

function buyOutNodeCallBack(request: UssdRequest, params: any) {
  console.log({ request, params });
}

const endNode = new UssdNode('Exit', UssdNodeType.end, [], 'Thank you for using TrueSoil');
const payNode = new UssdNode('Pay', UssdNodeType.prompt, [endNode], 'Enter UGX Amount:', payNodeCallBack);
const sellConcentNode = new UssdNode('Sell Concent', UssdNodeType.prompt, [endNode], 'You are about to request consent to sell on property. Write last two digits of your NIN to confirm.');
const sellNode = new UssdNode('Sell', UssdNodeType.prompt, [sellConcentNode], 'Enter UGX Amount:', sellNodeCallBack);
const buyNode = new UssdNode('Buy', UssdNodeType.prompt, [endNode], 'Enter UGX Amount:', buyOutNodeCallBack);

const propertyPaymentsNode = new UssdNode('Payments', UssdNodeType.list, [
  payNode,
  endNode
], 'Choose Property', paymentsPropertyList);

const propertySellNode = new UssdNode('Sell', UssdNodeType.list, [
  sellNode,
  endNode
], 'Choose Property', paymentsPropertyList);

const propertyBuyNode = new UssdNode('Buyout', UssdNodeType.list, [buyNode, endNode], 'Choose Property', buyPropertyList);

const requestListNode = new UssdNode('Requests', UssdNodeType.list, [endNode], 'Choose Request', paymentsRequestsList);

const contactTrueSoilNode = new UssdNode('Contact Truesoil', UssdNodeType.nav, [
  new UssdNode('Request us to Call You', UssdNodeType.end, [], 'We have received your request We will call you as soon as possible'),
  new UssdNode('Call TrueSoil', UssdNodeType.end, [], 'You can contact us at 256 123 123456'),
])

const englishNode = new UssdNode('English', UssdNodeType.nav, [
  propertyPaymentsNode,
  requestListNode,
  propertySellNode,
  contactTrueSoilNode,
  propertyBuyNode,
], 'What do you want to do?')

export const rootNode = new UssdNode(
  'Welcome to TrueSoil.',
  UssdNodeType.nav,
  [
    englishNode,
    new UssdNode('Luganda', UssdNodeType.nav, []),
  ]
);
