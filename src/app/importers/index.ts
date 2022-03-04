import { Env } from '@foal/core';
import { Disk } from '@foal/storage';
import Airtable from 'airtable';
import { getConnection } from 'typeorm';
import { importAirTable } from './airtable/importAirTable';
import { importAirtelReports } from './Airtel/importAirtelReports';
import { storeS3Asset } from './Assets/storeS3Asset';
import { importXLSXFile } from './Excel/importXLSXFile';
import { importHubImages } from './hubspot/importHubImages';
import { importJotForm } from './jotform/importJotForm';
import { importMTNReports } from './MTN/importMTNReports';
import { importJSONFile } from './ussd/importJSONFile';

export function purgeData() {
  const connection = getConnection();
  connection.query('TRUNCATE TABLE "property_groups" CASCADE; TRUNCATE TABLE "contacts" CASCADE; TRUNCATE TABLE "payments" CASCADE;')
}

export function importAllData(disk: Disk) {
  const connection = getConnection();
  const base = new Airtable({ apiKey: process.env.AIRTABLE_KEY }).base(
    process.env.AIRTABLE_ID || ''
  );

  const jf = require('jotform');
  jf.options({
    url: 'https://eu-api.jotform.com',
    debug: true,
    apiKey: process.env.JOTFORM_API_KEY,
  });

  try {
    importAirTable(base, connection.manager);
    importJotForm(jf, connection.manager, disk);
    importXLSXFile(connection.manager, 'payments.xlsx');
    importJSONFile(connection.manager, 'ussd.json');
    importAirtelReports(connection.manager);
    importMTNReports(connection.manager);
  } catch (error) {
    console.log(error);
  }
}

export function importJotform(disk: Disk) {
  const connection = getConnection();

  const jf = require('jotform');
  jf.options({
    url: 'https://eu-api.jotform.com',
    debug: true,
    apiKey: process.env.JOTFORM_API_KEY,
  });

  importJotForm(jf, connection.manager,
    disk
  );
}

export function importPaymentReports() {
  const connection = getConnection();

  importXLSXFile(connection.manager, 'payments.xlsx');
  importJSONFile(connection.manager, 'ussd.json');
  importAirtelReports(connection.manager);
  importMTNReports(connection.manager);
}

export function importAirtableData() {
  const connection = getConnection();
  const base = new Airtable({ apiKey: process.env.AIRTABLE_KEY }).base(
    process.env.AIRTABLE_ID || ''
  );
  importAirTable(base, connection.manager);
}

export function importHubspotData(disk: Disk) {
  const hubspot = require('@hubspot/api-client')
  const hub = new hubspot.Client({ apiKey: Env.get('HUBSPOT_KEY') });

  importHubImages(hub, disk);
  console.log('Not Now');
}

export async function updateS3Assets() {
  const AWS = require('aws-sdk');
  AWS.config.update({ region: Env.get('AWS_REGION') });
  const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

  const bucketParams = {
    Bucket: Env.get('AWS_BUCKET'),
  };

  const bucketdata: any = await s3.listObjects(bucketParams).promise();

  const s3files: any[] = bucketdata.Contents;

  s3files.forEach(s3file => storeS3Asset(s3file)
  );
}