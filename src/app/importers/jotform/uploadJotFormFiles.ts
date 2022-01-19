import { Attachment } from '../../models';
import { Repository } from 'typeorm';
import fs = require('fs');
import { PutObjectCommand, PutObjectCommandInput, S3Client } from '@aws-sdk/client-s3';
import {
  AttachmentStatus,
  SourceType,
} from '@titl-all/shared/dist/enum';
const https = require('https');

export async function uploadJotFormFiles(parentid: string, sourcetype: SourceType, uploadPath: string, repository: Repository<Attachment>, urls: string[], s3: S3Client) {
  urls.forEach(url => {
    https.get(url, {
      headers: {
        'APIKEY': process.env.JOTFORM_API_KEY || '',
        'content-type': 'application/octet-stream'
      }
    }, (res: { statusCode: number; headers: { location: any } }) => {
      // Image will be stored at this path
      const filename = url.split('/')[url.split('/').length - 1];
      const path = `${process.env.TEMP_DIR}/${filename}`;
      const wStream = fs.createWriteStream(path);
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        https.get(res.headers.location, (resp: { pipe: (arg0: fs.WriteStream) => void }) => {
          resp.pipe(wStream); // Save to local drive
          wStream.on('finish', () => {
            const rStream = fs.createReadStream(path);
            try { // Upload to S3 bucket
              const uploadTo = `${uploadPath}/${filename}`;
              console.log(uploadTo);
              s3.send(new PutObjectCommand({
                Bucket: process.env.AWS_BUCKET,
                Key: uploadTo,
                Body: rStream,
                ServerSideEncryption: 'AES256'
                // options:
              } as PutObjectCommandInput)).then(data => {
                console.log('Success', data);
                rStream.close();
                repository.save({
                  filePath: `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadTo}`,
                  // jotFormId: attachment.id,
                  hubSpotParentId: parentid,
                  sourceType: sourcetype,
                  status: AttachmentStatus.active
                } as Attachment).then(file => {
                  console.log(file);
                });
                return data;
              });
            } catch (err) {
              console.log('Error', err);
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
