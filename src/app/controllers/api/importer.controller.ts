import { S3Client } from '@aws-sdk/client-s3';
import {
  Context,
  HttpResponseOK,
  Get,
  Post,
  HttpResponseInternalServerError,
  HttpResponseBadRequest,
  HttpResponseNotImplemented,
  // dependency,
} from '@foal/core';
import Airtable from 'airtable';
import { importAirTable } from 'app/importers/airtable/importAirTable';
import { importAirtelReports } from 'app/importers/Airtel/importAirtelReports';
import { importXLSXFile } from 'app/importers/Excel/importXLSXFile';
// import { importHubImages } from 'app/importers/hubspot/importHubImages';
import { importJotForm } from 'app/importers/jotform/importJotForm';
import { importMTNReports } from 'app/importers/MTN/importMTNReports';
import { importJSONFile } from 'app/importers/ussd/importJSONFile';
// import * as hubspot from '@hubspot/api-client';
import { env } from 'process';
import { createConnection } from 'typeorm';
import { readAirtelCsvFile } from 'app/importers/Airtel/readAirtelCsvFile';
import { readMtnCsvFile } from 'app/importers/MTN/readMtnCsvFile';

const request = require('request');

export class ImporterController {

  @Get('/test')
  async getTest(ctx: Context) {
    console.log(ctx.request.baseUrl);
    return new HttpResponseOK({
      text: 'Import Test complete'
    });
  }

  @Get('/run')
  async runImporter(ctx: Context) {
    console.log(ctx.request.baseUrl);

    createConnection()
      .then(async connection => {
        const base = new Airtable({ apiKey: env.AIRTABLE_KEY }).base(
          env.AIRTABLE_ID || ''
        );
        // const hub = new hubspot.Client({ apiKey: env.HUBSPOT_KEY });
        const s3Client = new S3Client({ region: env.AWS_REGION });
        const jf = require('jotform');
        jf.options({
          url: 'https://eu-api.jotform.com',
          debug: true,
          apiKey: env.JOTFORM_API_KEY,
        });

        importAirTable(base, connection.manager);
        importJotForm(jf, connection.manager, s3Client);
        importXLSXFile(connection.manager, 'payments.xlsx');
        importJSONFile(connection.manager, 'ussd.json');
        importAirtelReports(connection.manager);
        importMTNReports(connection.manager);
        // importHubImages(hub, s3Client, connection.manager);
      }).catch(error => console.log(error));
    return new HttpResponseOK({
      text: 'Import Test complete'
    });
  }

  @Post('/sns')
  async snslistener(ctx: Context) {
    const connection = createConnection();

    console.debug(ctx.request.body);
    const message = JSON.parse(ctx.request.body);
    console.log(message);

    if (message.Type == 'SubscriptionConfirmation') {
      request.get(message.SubscribeURL, (err: any, resp: { body: any }) => {
        if (err) {
          console.log(err);
          return new HttpResponseInternalServerError(err);
        } else {
          console.log(resp)
          return new HttpResponseOK(resp.body);
        }
      })
    }

    if (message.Type == 'Notification') {
      const records = JSON.parse(message.Message);
      console.log(records);

      if (!records.Records[0].s3.object) {
        return new HttpResponseBadRequest('No object found');
      }

      if (message.TopicArn.includes('airtel')) {
        readAirtelCsvFile((await connection).manager, records.Records[0].s3.object);
        return new HttpResponseOK('Airtel Import Complete');
      }

      if (message.TopicArn.includes('mtn')) {
        readMtnCsvFile((await connection).manager, records.Records[0].s3.object);
        return new HttpResponseOK('MTN Import Complete');
      }

    }
    return new HttpResponseNotImplemented('Action Unknown');
  }
}
