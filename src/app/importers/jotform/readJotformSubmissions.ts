import {
  Agreement,
  Contact,
  Property,
  PropertyGroup,
} from '../../models';
import { EntityManager, IsNull, Not } from 'typeorm';
import {
  PropertyType,
} from '@titl-all/shared/dist/enum';
import { readJotFormValue } from '../../utils/jotform/readJotFormValue';
import { getJotformLC } from './getJotformLC';
import { getJotformTenant } from './getJotformTenant';
import { Disk } from '@foal/storage';
import { updateExistingAgreement } from './updateExistingAgreement';
import { getNewJotFormAgreement } from './getNewJotFormAgreement';

export function readJotformSubmissions(
  jf: any,
  manager: EntityManager,
  disk: Disk,
  id: any
) {
  const propertyGroupRepo = manager.getRepository(PropertyGroup);
  const propertyRepo = manager.getRepository(Property);

  jf.getFormSubmissions(id, {
    offset: 0,
    limit: 1000,
    filter: {
      status: 'ACTIVE',
      // "id": "5111331809412373928",
      // "updated_at:lt": "2013"
    },
    orderby: 'created_at',
    direction: 'ASC',
  })
    .then(async (records: any) => {
      const nickname = `${readJotFormValue(
        records[0],
        140,
        2
      )}_${readJotFormValue(records[0], 140, 3)}_${readJotFormValue(
        records[0],
        140,
        4
      )}`;

      let propertyGroup = await propertyGroupRepo.findOne({
        where: [{ nickname: nickname }, { jotFormId: id }],
      });
      if (!propertyGroup) {
        propertyGroup = {
          jotFormId: id,
          nickname: nickname,
          propertyType: PropertyType.mailo,
          lC: await getJotformLC(records[0], manager.getRepository(Contact)),
        } as PropertyGroup;
        propertyGroupRepo.save(propertyGroup);
      } else {
        propertyGroup.jotFormId = id;
        propertyGroupRepo.save(propertyGroup);
      }

      console.log(propertyGroup);

      const savedIds = await propertyRepo.find({
        select: ['jotFormId'],
        where: { jotFormId: Not(IsNull()) },
      });

      records.forEach(async (record: any) => {
        if (!savedIds.find(p => p.jotFormId == record.id)) {

          const tenant = await getJotformTenant(
            record,
            manager.getRepository(Contact)
          );
          if (!tenant.jotFormId) {
            tenant.jotFormId = record.id;
            await Contact.save(tenant);
          }

          let existingAgreement = await Agreement.createQueryBuilder('agreement')
            .leftJoinAndSelect("agreement.property", "property")
            .leftJoinAndSelect("agreement.owner", "owner")
            .leftJoinAndSelect("agreement.tenant", "tenant")
            .leftJoinAndSelect("agreement.paymentPlans", "paymentPlans")
            .where('agreement.tenantId = :tenantId', { tenantId: tenant.id })
            .getOne();

          const newAgreement: Agreement = getNewJotFormAgreement(record, propertyGroup, tenant);

          if (existingAgreement) {
            try {
              existingAgreement = updateExistingAgreement(existingAgreement, newAgreement);
              console.log(existingAgreement);
              if (!existingAgreement.property.propertyGroup.jotFormId) {
                existingAgreement.property.propertyGroup.jotFormId = id;
                await PropertyGroup.save(existingAgreement.property.propertyGroup);
              }
              await Agreement.save(existingAgreement);
            } catch (error) {
              console.log(error);
            }
          } else {
            console.log(newAgreement);
            await Agreement.save(newAgreement);
          }

          if (disk) {
            console.log('Upload Files');
          }
        }
      });
      console.log('Import Complete');
    })
    .fail(function (e: any) {
      console.log({ id, e });
    });
}
