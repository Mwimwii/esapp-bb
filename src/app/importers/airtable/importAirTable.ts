import { EntityManager } from 'typeorm';
import { importTenants } from './importTenants';
import { importLandowners } from './importLandowners';
import { importLandGroups } from './importLandGroups';
import { importLandRights } from './importLandRights';
import { AirtableBase } from 'airtable/lib/airtable_base';

export async function importAirTable(base: AirtableBase, manager: EntityManager) {
    importLandRights(base, manager);
    importLandowners(base, manager);
    importLandGroups(base, manager);
    importTenants(base, manager);
}
