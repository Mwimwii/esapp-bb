import { EntityManager } from 'typeorm';

export async function updateRelations(manager: EntityManager) {
    await new Promise(r => setTimeout(r, 30000));

    console.log('Starting updateRelations');

    await manager.query(
        `update "property_groups" pg 
          set "ownerId" = (select id from "contacts" where "airTableId" = pg."airTableParentId" LIMIT 1) 
          where "ownerId" is NULL;`
        + `update "properties" pg 
            set "propertyGroupId" = (SELECT "id" FROM "property_groups" WHERE "airTableId" = pg."airTableParentId" LIMIT 1), 
            "ownerId" = (SELECT "ownerId" FROM "property_groups" WHERE "airTableId" = pg."airTableParentId" LIMIT 1) 
            where "propertyGroupId" is NULL or "ownerId" is NULL;`
        + `update "agreements" a 
            set "tenantId"  = (select id from "contacts" where "airTableId" = a."airTableTenantId" LIMIT 1), 
            "ownerId" = (select "ownerId" from "properties" where id = a."propertyId" LIMIT 1) 
            WHERE "tenantId" is NULL ;`);

    await manager.query(`update payments p set "paymentPlanId"  = pp.id
            from contact_details cd
            join contacts c on c.id = cd."contactId"
            join agreements a on a."tenantId" = cd."contactId"
            join payment_plans pp on pp."agreementId"  = a.id
            where p."paymentPlanId" is null and	p."paidWithAccount" = cd."contactDetailValue" and  p."paymentType"::text =pp."paymentType"::text;`);

    console.log('Completed updateRelations');
}
