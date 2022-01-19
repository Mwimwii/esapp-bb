import { S3Client } from "@aws-sdk/client-s3";
import Airtable from "airtable";
import * as hubspot from "@hubspot/api-client";
import { getConnection } from "typeorm";
import { importAirTable } from "./airtable/importAirTable";
import { importAirtelReports } from "./Airtel/importAirtelReports";
import { importXLSXFile } from "./Excel/importXLSXFile";
import { importHubImages } from "./hubspot/importHubImages";
import { importJotForm } from "./jotform/importJotForm";
import { importMTNReports } from "./MTN/importMTNReports";
import { importJSONFile } from "./ussd/importJSONFile";

export function importAllData() {
  const connection = getConnection();
  const base = new Airtable({ apiKey: process.env.AIRTABLE_KEY }).base(
    process.env.AIRTABLE_ID || ''
  );
  // const hub = new hubspot.Client({ apiKey: process.env.HUBSPOT_KEY });
  // const s3Client = new S3Client({ region: process.env.AWS_REGION || 'titl' });
  // const jf = require("jotform");
  // jf.options({
  //   url: "https://eu-api.jotform.com",
  //   debug: true,
  //   apiKey: process.env.JOTFORM_API_KEY,
  // });

  importAirTable(base, connection.manager);
  // importJotForm(jf, connection.manager, s3Client);
  importXLSXFile(connection.manager, `payments.xlsx`);
  importJSONFile(connection.manager, `ussd.json`);
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

export function importHubspotData() {
  const connection = getConnection();
  const hub = new hubspot.Client({ apiKey: process.env.HUBSPOT_KEY });
  const s3Client = new S3Client({ region: process.env.AWS_REGION || 'titl' });

  importHubImages(hub, s3Client, connection.manager);
}