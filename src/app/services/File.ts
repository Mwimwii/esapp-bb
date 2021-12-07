import path from 'path';
import { Disk } from '@foal/storage';
import { dependency } from '@foal/core';

import { TenantService } from 'app/services';
import { OnboardingFiles } from 'app/types';
import { OnboardingQuestions } from '@titl-all/shared/dist/types';

export class FileService {
  @dependency
  disk: Disk;

  @dependency
  tenantService: TenantService;

  async add(data: Partial<OnboardingQuestions>, files: OnboardingFiles) {
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
    } = files;

    let iDShortCode = '';
    const directoryName = `0_${firstName}_${lastName}`;
    const phoneNumber = this.tenantService.obtainNonWhatsAppPhoneNumber(
      String(firstPhoneNumber),
      String(firstNumberIsWhatsApp),
      String(secondPhoneNumber),
      String(secondNumberIsWhatsApp),
    );

    if (identificationImageFront || identificationImageBack) {
        iDShortCode = this.getShortCodeForIdentification(String(identificationType));
    }

    if (identificationImageFront) {
      await this.disk.write(`attachments/contacts/${directoryName}`, identificationImageFront.buffer, {
        // TODO won't have access to the number or exp date
        name: `ID_${iDShortCode}_0_0_.${path.extname(String(identificationImageFront.filename))}`,
      });
    }

    if (identificationImageBack) {
      await this.disk.write(`attachments/contacts/${directoryName}`, identificationImageBack.buffer, {
        // TODO won't have access to the number or exp date
        name: `ID_${iDShortCode}_0_0_.${path.extname(String(identificationImageBack.filename))}`,
      });
    }

    if (agreement) {
      await this.disk.write(`attachments/contacts/${directoryName}`, agreement.buffer, {
        name: `DOC_AGREEMENT_${firstName?.toUpperCase()}_${lastName?.toUpperCase()}_${phoneNumber}_.${path.extname(String(agreement.filename))}`,
      });
    }

    if (consentImageFront) {
      await this.disk.write(`attachments/contacts/${directoryName}`, consentImageFront.buffer, {
        name: `DOC_CONSENT_${firstName?.toUpperCase()}_${lastName?.toUpperCase()}_${phoneNumber}_.${path.extname(String(consentImageFront.filename))}`,
      });

    }

    if (consentImageBack) {
      await this.disk.write(`attachments/contacts/${directoryName}`, consentImageBack.buffer, {
        name: `DOC_CONSENT_${firstName?.toUpperCase()}_${lastName?.toUpperCase()}_${phoneNumber}_.${path.extname(String(consentImageBack.filename))}`,
      });
    }
  }

  getShortCodeForIdentification(type: string): string {
    switch(type) {
      case 'National Id':
        return 'NIN';
      case 'Driver\'s License':
        return 'DRV';
      case 'Passport':
        return 'PAS';
      // TODO update documentation https://github.com/titl-all/data-importer/blob/main/AWS_Image_Cleanup.md
      case 'Village Id':
        return 'VID';
    }

    return '';
  }
}

