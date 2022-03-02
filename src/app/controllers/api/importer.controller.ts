import {
  Context,
  HttpResponseOK,
  Get,
  dependency
} from '@foal/core';
import { Disk } from '@foal/storage';
import { updateS3Assets, importAirtableData, importAllData, importHubspotData, purgeData, importJotform, importPaymentReports } from 'app/importers';

export class ImporterController {

  @dependency
  disk: Disk;

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

    importJotform(this.disk);

    return new HttpResponseOK({
      text: 'Import Test complete'
    });
  }

  @Get('/hubspot')
  async runHubspot(ctx: Context) {
    console.log(ctx.request.baseUrl);

    importHubspotData(this.disk);

    return new HttpResponseOK({
      text: 'Hubspot Importer Running'
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
    importAllData(this.disk);
    return new HttpResponseOK({
      text: 'Import Test complete'
    });
  }

  @Get('/assets')
  async updateAssets(ctx: Context) {
    console.log(ctx.request.baseUrl);
    updateS3Assets();
    return new HttpResponseOK({
      text: 'Asset Update Running'
    });
  }
}


