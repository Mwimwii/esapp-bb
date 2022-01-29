// import { S3Client } from '@aws-sdk/client-s3';
import {
  Context,
  HttpResponseOK,
  Get,
  // Post,
  // HttpResponseInternalServerError,
  // HttpResponseBadRequest,
  // HttpResponseNotImplemented,
  // dependency,
} from '@foal/core';
import { importAirtableData, importAllData, importHubspotData, purgeData, importJotform, importPaymentReports } from 'app/importers';

// const request = require('request');

export class ImporterController {

  @Get('/test')
  async getTest(ctx: Context) {
    console.log(ctx.request.baseUrl);
    return new HttpResponseOK({
      text: 'Import Test complete'
    });
  }

  @Get('/purge')
  async purge(ctx: Context) {
    console.log(ctx.request.baseUrl);

    purgeData();

    return new HttpResponseOK({
      text: 'Import Test complete'
    });
  }

  @Get('/airtable')
  async runAirtable(ctx: Context) {
    console.log(ctx.request.baseUrl);

    importAirtableData();

    return new HttpResponseOK({
      text: 'Import Test complete'
    });
  }

  @Get('/jotform')
  async runJotForm(ctx: Context) {
    console.log(ctx.request.baseUrl);

    importJotform();

    return new HttpResponseOK({
      text: 'Import Test complete'
    });
  }

  @Get('/hubspot')
  async runHubspot(ctx: Context) {
    console.log(ctx.request.baseUrl);

    importHubspotData();

    return new HttpResponseOK({
      text: 'Import Test complete'
    });
  }

  @Get('/payments')
  async runPayments(ctx: Context) {
    console.log(ctx.request.baseUrl);

    importPaymentReports();

    return new HttpResponseOK({
      text: 'Import Test complete'
    });
  }

  @Get('/runall')
  async runImporter(ctx: Context) {
    console.log(ctx.request.baseUrl);
    importAllData();
    return new HttpResponseOK({
      text: 'Import Test complete'
    });
  }

  // @Get('/run')
  // async runImporter(ctx: Context) {
  //   console.log(ctx.request.baseUrl);

  //   const connection = getConnection();
  //   const base = new Airtable({ apiKey: process.env.AIRTABLE_KEY }).base(
  //     process.env.AIRTABLE_ID || ''
  //   );
  //   const hub = new hubspot.Client({ apiKey: env.HUBSPOT_KEY });
  //   const s3Client = new S3Client({ region: env.AWS_REGION });
  //   const jf = require('jotform');
  //   jf.options({
  //     url: 'https://eu-api.jotform.com',
  //     debug: true,
  //     apiKey: env.JOTFORM_API_KEY,
  //   });

  //   importAirTable(base, connection.manager);
  //   importJotForm(jf, connection.manager, s3Client);
  //   importXLSXFile(connection.manager, 'payments.xlsx');
  //   importJSONFile(connection.manager, 'ussd.json');
  //   importAirtelReports(connection.manager);
  //   importMTNReports(connection.manager);
  //   importHubImages(hub, s3Client, connection.manager);

  //   console.log({connection, any:'base'});

  //   return new HttpResponseOK({
  //     text: 'Import Test complete'
  //   });
  // }

  // @Post('/sns')
  // async snslistener(ctx: Context) {
  //   const connection = createConnection();

  //   console.debug(ctx.request.body);
  //   const message = JSON.parse(ctx.request.body);
  //   console.log(message);

  //   if (message.Type == 'SubscriptionConfirmation') {
  //     request.get(message.SubscribeURL, (err: any, resp: { body: any }) => {
  //       if (err) {
  //         console.log(err);
  //         return new HttpResponseInternalServerError(err);
  //       } else {
  //         console.log(resp)
  //         return new HttpResponseOK(resp.body);
  //       }
  //     })
  //   }

  //   if (message.Type == 'Notification') {
  //     const records = JSON.parse(message.Message);
  //     console.log(records);

  //     if (!records.Records[0].s3.object) {
  //       return new HttpResponseBadRequest('No object found');
  //     }

  //     if (message.TopicArn.includes('airtel')) {
  //       readAirtelCsvFile((await connection).manager, records.Records[0].s3.object);
  //       return new HttpResponseOK('Airtel Import Complete');
  //     }

  //     if (message.TopicArn.includes('mtn')) {
  //       readMtnCsvFile((await connection).manager, records.Records[0].s3.object);
  //       return new HttpResponseOK('MTN Import Complete');
  //     }

  //   }
  //   return new HttpResponseNotImplemented('Action Unknown');
  // }
}

