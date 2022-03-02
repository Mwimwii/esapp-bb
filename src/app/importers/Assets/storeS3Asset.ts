import { Asset } from 'app/models';
import { getAsset } from './getAsset';

export function storeS3Asset(s3file: any) {
  (async () => {
    if (!(await Asset.findOne({ where: [{ path: s3file.Key }] }))) {
      const asset = await getAsset(s3file.Key);
      if (asset) {
        asset.size = s3file.Size;
        Asset.save(asset);
      }
      console.log(asset);
    }
  })();
}
