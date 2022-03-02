import * as hubspot from '@hubspot/api-client';
import fs = require('fs');
import https = require('https');
import { Env } from '@foal/core';
import { Disk } from '@foal/storage';
import { Asset } from 'app/models';

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

export async function importHubImages(hub: hubspot.Client, disk: Disk) {
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
      path: `/engagements/v1/engagements/paged?hapikey=${Env.get('HUBSPOT_KEY')}&limit=${counter.limit}&offset=${counter.offset}`
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
            path: `/crm/v3/objects/contacts/${result.associations.contactIds[0]}?hapikey=${Env.get('HUBSPOT_KEY')}`
          });
          cnct = {
            id: contactApi.body.id,
            firstname: contactApi.body.properties.firstname,
            lastname: contactApi.body.properties.lastname
          };
        } else if (result.associations.companyIds.length > 0) {
          const companyApi = await hub.apiRequest({
            method: 'GET',
            path: `/crm/v3/objects/companies/${result.associations.companyIds[0]}?hapikey=${Env.get('HUBSPOT_KEY')}`
          });
          cnct = {
            id: companyApi.body.id,
            firstname: companyApi.body.properties.firstname,
            lastname: companyApi.body.properties.lastname
          };
        }

        const foldername = ((`${cnct.id}_${cnct.firstname}_${cnct.lastname}`).replace(/[(){}/]/gi, '')).replace(' ', '_');

        Asset.findOne({ where: { hubSpotId: attachment.id } }) // Start Duplicate hubspot ID check
          .then(tableFile => {
            if (!tableFile) { // Download if does not exit
              hub.apiRequest({
                method: 'GET',
                path: `/filemanager/api/v3/files/${attachment.id}/signed-url?hapikey=${Env.get('HUBSPOT_KEY')}`
              }).then(signedResult => {
                https.get(signedResult.body.url, res => {
                  // Image will be stored at this path
                  const path = `${Env.get('TEMP_DIR')}/${signedResult.body.name}.${signedResult.body.extension}`;
                  const wStream = fs.createWriteStream(path);
                  res.pipe(wStream); // Save to local drive
                  wStream.on('finish', async () => {
                    const rStream = fs.createReadStream(path);
                    try { // Upload to S3 bucket
                      const file = await disk.write(
                        `attachments/contacts/${foldername}`,
                        rStream,
                        {
                          name: signedResult.body.name,
                          extension: signedResult.body.extension
                        }
                      );

                      const asset = {
                        path: file.path,
                        size: signedResult.body.size,
                        name: signedResult.body.name,
                        bucket: Env.get('AWS_BUCKET'),

                      } as Asset;

                      console.log(asset);
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
