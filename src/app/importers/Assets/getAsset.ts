import { Env } from '@foal/core';
import { Agreement, Asset, Contact, Property } from 'app/models';
import { mapAssetType } from './mapAssetType';

export async function getAsset(key: string): Promise<Asset | undefined> {
  const splits = key.replace('__', '_').replace(' ', '').split('/');

  let splitIds = [];
  let splitDoc = [];
  if (splits.length === 6) {

    splitDoc = splits[5].split('_');
    const names = splits[3].split('_');
    const tenant = await Contact.findOne({ where: [{ firstName: names[0], lastName: names[1] }, { jotFormId: splits[2] }] });
    return ({
      name: splits[5],
      type: mapAssetType(splitDoc.length > 1 ? splitDoc[0] : splits[4]),
      path: key,
      bucket: Env.get('AWS_BUCKET'),
      jotFormId: splits[2],
      ownedByContact: tenant,
      ownedByProperty: await Property.findOne({ where: [{ jotFormId: splits[2] }] }),
      ownedByAgreement: await Agreement.findOne({ where: [{ tenant: tenant }] })
    }) as Asset;
  }
  else if (splits.length === 4) {
    splitIds = splits[2].split('_');
    const splitTitle = splits[3].split('_');
    splitDoc = splits[3].split('_');
    const tenant = await Contact.findOne({ where: [{ firstName: splitIds[1], lastName: splitIds[2] }, { hubSpotId: splitIds[0] }] })
    return ({
      name: splits[3],
      type: mapAssetType(splitTitle.length > 1 ? splitTitle[1] : splitTitle[0]),
      path: key,
      bucket: Env.get('AWS_BUCKET'),
      hubSpotId: splitIds[0],
      ownedByContact: tenant,
      ownedByProperty: await Property.findOne({ where: { hubSpotId: splitIds[0] } }),
      ownedByAgreement: await Agreement.findOne({ where: [{ tenant: tenant }] })
    }) as Asset;
  }
  return;
}
