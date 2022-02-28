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
                try {
                  if (await disk.write(uploadTo, rStream)) {
                    // const upload = await disk.write(uploadTo, rStream);
                    // console.log(upload);
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
                } catch (error) {
                  console.log(error);
                }
                // s3.send(new PutObjectCommand({
                //   Bucket: Env.get('AWS_BUCKET'),
                //   Key: uploadTo,
                //   Body: rStream,
                //   ServerSideEncryption: 'AES256'
                //   // options:
                // } as PutObjectCommandInput)).then(data => {
                //   console.log('Success', data);
                //   rStream.close();
                //   repository.save({
                //     filePath: `https://${Env.get('AWS_BUCKET}.s3.${Env.get('AWS_REGION}.amazonaws.com/${uploadTo}`,
                //     // jotFormId: attachment.id,
                //     hubSpotParentId: parentid,
                //     // sourceType: sourcetype,
                //     status: AttachmentStatus.active
                //   } as Attachment).then(file => {
                //     console.log(file);
                //   });
                //   return data;
                // });
              } catch (err) {
                console.log('Error', err);
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
