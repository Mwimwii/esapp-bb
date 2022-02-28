import {
  Context,
  HttpResponseOK,
  Get,
  dependency,
  Env
} from '@foal/core';
import { Disk } from '@foal/storage';
import { importAirtableData, importAllData, importHubspotData, purgeData, importJotform, importPaymentReports } from 'app/importers';
import { Asset } from 'app/models';
import { getManager } from 'typeorm';
import { getAsset } from '../../importers/Assets/getAsset';

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
    importAllData(this.disk);
    return new HttpResponseOK({
      text: 'Import Test complete'
    });
  }

  @Get('/assets')
  async updateAssets() {
    const AWS = require('aws-sdk');
    const assetRepo = getManager().getRepository(Asset);
    AWS.config.update({ region: Env.get('AWS_REGION') });
    const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

    const bucketParams = {
      Bucket: Env.get('AWS_BUCKET'),
    };

    let bucketdata: any[] = [];

    s3.listObjects(bucketParams, (err: any, data: any) => {
      if (err) {
        console.log('Error', err);
      } else {
        bucketdata = data.Contents;

        bucketdata.forEach(s3file => {
          async () => {
            if (!(await assetRepo.findOne({ where: [{ path: s3file.Key }] }))) {
              const asset = await getAsset(s3file.Key);
              if (asset) {
                assetRepo.save(asset);
              }
              console.log(asset);
            }
          }
        }
        );
      }
    });

    return new HttpResponseOK({
      text: 'Asset Update Running'
    });
  }
}
