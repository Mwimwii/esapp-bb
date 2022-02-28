import { Disk } from '@foal/storage';
import { EntityManager } from 'typeorm';
import { readJotformSubmissions } from './readJotformSubmissions';

export async function importJotForm(
  jf: any,
  manager: EntityManager,
  disk: Disk
) {
  const folders = await jf.getFolders();
  folders.subfolders
    .find((q: any) => q.id == '602d44b2687a494344142c02')
    .forms.forEach((form: any) => {
      if (form.status == 'ENABLED') {
        console.log(`${form.id} - ${form.title}`);
        readJotformSubmissions(jf, manager,
          disk,
          form.id);
      }
    });
}
