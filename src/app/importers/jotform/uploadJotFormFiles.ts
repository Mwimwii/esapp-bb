import { Asset } from '../../models';
import fs = require('fs');
import {
  AssetType,
} from '@titl-all/shared/dist/enum';
import { Env } from '@foal/core';
import { Disk } from '@foal/storage';
const https = require('https');

export async function uploadJotFormFiles(parentid: string, assetType: AssetType, uploadPath: string, urls: string[], disk: Disk) {
  urls.forEach(url => {
    https.get(url, {
      headers: {
        'APIKEY': Env.get('JOTFORM_API_KEY') || '',
        'content-type': 'application/octet-stream'
      }
    }, (res: { statusCode: number; headers: { location: any } }) => {
      // Image will be stored at this path
      const filename = url.split('/')[url.split('/').length - 1];
      const path = `${Env.get('TEMP_DIR')}/${filename}`;
      const wStream = fs.createWriteStream(path);
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        https.get(res.headers.location, (resp: { pipe: (arg0: fs.WriteStream) => void }) => {
          resp.pipe(wStream); // Save to local drive
          wStream.on('finish', () => {
            async () => {
              const rStream = fs.createReadStream(path);
              try { // Upload to S3 bucket
                const uploadTo = `${uploadPath}/${filename}`;
                console.log(uploadTo);
                if (await disk.write(uploadTo, rStream)) {
                  console.log(
                    {
                      jotFormId: parentid,
                      type: assetType,
                      path: uploadTo,
                      bucket: Env.get('AWS_BUCKET')
                    } as Asset
                  );

                  return (
                    {
                      jotFormId: parentid,
                      type: assetType,
                      path: uploadTo,
                      bucket: Env.get('AWS_BUCKET')
                    } as Asset
                  );
                }
              } catch (err) {
                console.log('Error', err);
                return err;
              }
            }
            wStream.close();
          }).on('error', err => {
            console.log(err);
          });
        });
      }
    }).on('error', (err: { message: any }) => {
      console.log('Error: ', err.message);
    });
  });
}
