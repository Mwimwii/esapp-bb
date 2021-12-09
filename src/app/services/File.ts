import path from 'path';
import { Disk, File } from '@foal/storage';
import { dependency, Env } from '@foal/core';

import { Asset, Contact, User } from 'app/models';
import { OnboardingFiles } from 'app/types';
import { OnboardingQuestions } from '@titl-all/shared/dist/types';
import { AssetType } from '@titl-all/shared/dist/enum';
import { obtainNonWhatsAppPhoneNumber } from 'app/utils';

export class FileService {
  @dependency
  disk: Disk;

  async add(
    data: Partial<OnboardingQuestions>,
    files: OnboardingFiles,
    contact: Contact,
    user: User,
  ) {
    const {
      firstName,
      lastName,
      firstPhoneNumber,
      firstNumberIsWhatsApp,
      secondPhoneNumber,
      secondNumberIsWhatsApp,
      identificationType,
    } = data;

    const {
      identificationImageFront,
      identificationImageBack,
      agreement,
      consentImageFront,
      consentImageBack,
      tenantPicture,
    } = files;

    let codes = { shortCode: 'OTH', assetType: AssetType.other };
    const directoryName = `0_${firstName}_${lastName}`;
    const assetPath = `attachments/contacts/${directoryName}`;

    const phoneNumber = obtainNonWhatsAppPhoneNumber(
      String(firstPhoneNumber),
      String(firstNumberIsWhatsApp),
      String(secondPhoneNumber),
      String(secondNumberIsWhatsApp),
    );

    if (tenantPicture) {
      const pictureName = `PROFILE_PORT_${firstName?.toUpperCase()}_${lastName?.toUpperCase()}_${phoneNumber}${path.extname(String(tenantPicture.filename))}`;
      await this.saveAsset(tenantPicture, AssetType.profile, pictureName, assetPath, contact, user);
    }

    if (identificationImageFront || identificationImageBack) {
      codes = this.getCodesForIdentification(String(identificationType));
    }

    if (identificationImageFront) {
      // TODO won't have access to the number or exp date
      const idFrontName = `ID_${codes.shortCode}_FRONT_0_0${path.extname(String(identificationImageFront.filename))}`;
      await this.saveAsset(identificationImageFront, codes.assetType, idFrontName, assetPath, contact, user);
    }

    if (identificationImageBack) {
      // TODO won't have access to the number or exp date
      const idBackName = `ID_${codes.shortCode}_BACK_0_0${path.extname(String(identificationImageBack.filename))}`;
      await this.saveAsset(identificationImageBack, codes.assetType, idBackName, assetPath, contact, user);
    }

    if (agreement) {
      const agreementName = `DOC_AGREEMENT_${firstName?.toUpperCase()}_${lastName?.toUpperCase()}_${phoneNumber}${path.extname(String(agreement.filename))}`;
      await this.saveAsset(agreement, AssetType.agreement, agreementName, assetPath, contact, user);
    }

    if (consentImageFront) {
      const consentFrontName = `DOC_CONSENT_FRONT_${firstName?.toUpperCase()}_${lastName?.toUpperCase()}_${phoneNumber}${path.extname(String(consentImageFront.filename))}`;
      await this.saveAsset(consentImageFront, AssetType.consent, consentFrontName, assetPath, contact, user);
    }

    if (consentImageBack) {
      const consentBackName = `DOC_CONSENT_BACK_${firstName?.toUpperCase()}_${lastName?.toUpperCase()}_${phoneNumber}${path.extname(String(consentImageBack.filename))}`;
      await this.saveAsset(consentImageBack, AssetType.consent, consentBackName, assetPath, contact, user);
    }
  }

  getCodesForIdentification(type: string): { shortCode: string; assetType: AssetType } {
    switch(type) {
      case 'National Id':
        return { shortCode: 'NIN', assetType: AssetType.nationalId };
      case 'Driver\'s License':
        return { shortCode: 'DRV', assetType: AssetType.driversLicense };
      case 'Passport':
        return { shortCode: 'PAS', assetType: AssetType.passport };
      // TODO update documentation https://github.com/titl-all/data-importer/blob/main/AWS_Image_Cleanup.md
      case 'Village Id':
        return { shortCode: 'VID', assetType: AssetType.villageId };
    }

    return { shortCode: 'OTH', assetType: AssetType.other };
  }

  async saveAsset(file: File, type: AssetType, name: string, path: string, contact: Contact, user: User) {
    await this.disk.write(path, file.buffer, {
      name,
    });

    const s3Bucket = Env.get('AWS_BUCKET');
    const asset = new Asset();
    asset.name = name;
    asset.type = type;
    asset.path = path;
    asset.bucket = String(s3Bucket);
    asset.ownedBy = contact;
    asset.uploadedBy = user;

    asset.save();
  }
}

