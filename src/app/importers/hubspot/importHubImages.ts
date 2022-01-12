import { env } from 'process';
import { EntityManager } from 'typeorm';
import { Attachment } from '../../models';
import * as hubspot from '@hubspot/api-client';
import fs = require('fs');
import https = require('https');
import { AttachmentStatus } from '@titl-all/shared/dist/enum';
import { PutObjectCommand, PutObjectCommandInput, S3Client } from '@aws-sdk/client-s3';

function findUrls(text: any) {
  const source = (text || '').toString();
  const urlArray: any[] = [];
  let matchArray;

  // Regular expression to find FTP, HTTP(S) and email URLs.
  const regexToken = new RegExp('/(((https?)://)[-w@:%_+.~#?,&//=]+)/g'); // ==> /(((https?):\/\/)[\-\w@:%_\+.~#?,&\/\/=]+)/g

  // Iterate through any URLs in the text.
  while ((matchArray = regexToken.exec(source)) !== null) {
    let token = matchArray[0];
    if (!urlArray.includes(token)) {
      token = token.replace('https://api.hubspot.com/filemanager/api/v2/files/', '').replace('/signed-url-redirect?portalId=9151217', '');
      urlArray.push({ id: `${token}` });
    }
  }
  return urlArray;
}

export async function importHubImages(hub: hubspot.Client, s3: S3Client, manager: EntityManager) {
  const fileRepo = manager.getRepository(Attachment);
  const counter = {
    page: 0,
    limit: 250,
    offset: 0,
    attachments: 0,
    hasMore: false
  };
  do {
    const engagementResult = await hub.apiRequest({
      method: 'GET',
      path: `/engagements/v1/engagements/paged?hapikey=${env.HUBSPOT_KEY}&limit=${counter.limit}&offset=${counter.offset}`
    });

    engagementResult.body.results.filter((r: any) => r.attachments.length > 0 || (r.engagement.bodyPreviewHtml && r.engagement.bodyPreviewHtml.includes('/filemanager/api/v2/files'))).forEach((result: { attachments: any[]; engagement: { bodyPreviewHtml: any }; associations: { contactIds: string | any[]; companyIds: string | any[] } }) => {
      result.attachments = result.attachments.concat(findUrls(result.engagement.bodyPreviewHtml));
      counter.attachments += result.attachments.length;
      result.attachments.forEach(async (attachment: any) => {
        let cnct = {
          id: 0,
          firstname: 'user',
          lastname: 'unknown'
        };

        if (result.associations.contactIds.length > 0) {
          const contactApi = await hub.apiRequest({
            method: 'GET',
            path: `/crm/v3/objects/contacts/${result.associations.contactIds[0]}?hapikey=${env.HUBSPOT_KEY}`
          });
          cnct = {
            id: contactApi.body.id,
            firstname: contactApi.body.properties.firstname,
            lastname: contactApi.body.properties.lastname
          };
        } else if (result.associations.companyIds.length > 0) {
          const companyApi = await hub.apiRequest({
            method: 'GET',
            path: `/crm/v3/objects/companies/${result.associations.companyIds[0]}?hapikey=${env.HUBSPOT_KEY}`
          });
          cnct = {
            id: companyApi.body.id,
            firstname: companyApi.body.properties.firstname,
            lastname: companyApi.body.properties.lastname
          };
        }

        const foldername = ((`${cnct.id}_${cnct.firstname}_${cnct.lastname}`).replace(/[(){}/]/gi, '')).replace(' ', '_');

        Attachment.findOne({ where: { hubSpotId: attachment.id } }) // Start Duplicate hubspot ID check
          .then(tableFile => {
            if (!tableFile) { // Download if does not exit
              hub.apiRequest({
                method: 'GET',
                path: `/filemanager/api/v3/files/${attachment.id}/signed-url?hapikey=${env.HUBSPOT_KEY}`
              }).then(signedResult => {
                https.get(signedResult.body.url, res => {
                  // Image will be stored at this path
                  const path = `${env.TEMP_DIR}/${signedResult.body.name}.${signedResult.body.extension}`;
                  const wStream = fs.createWriteStream(path);
                  res.pipe(wStream); // Save to local drive
                  wStream.on('finish', () => {
                    const rStream = fs.createReadStream(path);
                    try { // Upload to S3 bucket
                      s3.send(new PutObjectCommand(<PutObjectCommandInput>{
                        Bucket: env.AWS_BUCKET,
                        Key: `attachments/contacts/${foldername}/${signedResult.body.name}.${signedResult.body.extension}`,
                        Body: rStream,
                        ServerSideEncryption: 'AES256'
                        // options:
                      })).then(data => {
                        console.log('Success', data);
                        rStream.close();
                        fileRepo.save(<Attachment>{
                          filePath: `https://${env.AWS_BUCKET}.s3.${env.AWS_REGION}.amazonaws.com/attachments/contacts/${foldername}/${signedResult.body.name}.${signedResult.body.extension}`,
                          hubSpotId: attachment.id,
                          hubSpotParentId: `${cnct.id}`,
                          status: AttachmentStatus.active
                        }).then(file => {
                          console.log(file);
                        });
                        return data;
                      });
                    } catch (err) {
                      console.log('Error', err);
                    }
                    wStream.close();
                  });
                }).on('error', err => {
                  console.log('Error: ', err.message);
                });
              });
            }
          });
      });
    });

    if (engagementResult.body.hasMore) {
      counter.page += 1;
      counter.offset = engagementResult.body.offset;
      counter.hasMore = engagementResult.body.hasMore
    } else {
      counter.hasMore = false;
    }
    console.log(counter);
  } while (counter.hasMore);
}
