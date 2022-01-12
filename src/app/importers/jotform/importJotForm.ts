import { EntityManager } from 'typeorm';
import { S3Client } from '@aws-sdk/client-s3';
import { readJotformSubmissions } from './readJotformSubmissions';

export async function importJotForm(
  jf: any,
  manager: EntityManager,
  s3Client: S3Client
) {
  const folders = await jf.getFolders();
  folders.subfolders
    .find((q: any) => q.id == '602d44b2687a494344142c02')
    .forms.forEach((form: any) => {
      if (form.status == 'ENABLED') {
        console.log(`${form.id} - ${form.title}`);
        readJotformSubmissions(jf, manager, s3Client, form.id);
      }
    });
}
