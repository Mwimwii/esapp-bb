import { Env } from '@foal/core';
import { Agreement, Asset, Contact, Property } from 'app/models';
import { mapAssetType } from './mapAssetType';

export async function getAsset(key: string): Promise<Asset | undefined> {
  let splits = key.replace('__', '_').replace(' ', '').split('/');

  let split_ids = [];
  let split_doc = [];
  switch (splits.length) {
    case 6:
      split_doc = splits[5].split('_');
      const names = splits[3].split('_');
      return ({
        name: splits[5],
        type: mapAssetType(split_doc.length > 1 ? split_doc[0] : splits[4]),
        path: key,
        bucket: Env.get('AWS_BUCKET'),
        jotFormId: splits[2],
        ownedByContact: await Contact.findOne({ where: [{ firstName: names[0], lastName: names[1] }, { jotFormId: splits[2] }] }),
        ownedByProperty: await Property.findOne({ where: { jotFormId: splits[2] } }),
        ownedByAgreement: await Agreement.findOne({ where: { jotFormId: splits[2] } })
      }) as Asset;
    case 4:
      split_ids = splits[2].split('_');
      const split_xx = splits[3].split('_');
      split_doc = splits[3].split('_');
      return ({
        name: splits[3],
        type: mapAssetType(split_xx.length > 1 ? split_xx[1] : split_xx[0]),
        path: key,
        bucket: Env.get('AWS_BUCKET'),
        hubSpotId: split_ids[0],
        ownedByContact: await Contact.findOne({ where: [{ firstName: split_ids[1], lastName: split_ids[2] }, { hubSpotId: split_ids[0] }] }),
        ownedByProperty: await Property.findOne({ where: { hubSpotId: split_ids[0] } })
      }) as Asset;
    default:
      return;
  }
}
