import { Factory, Seeder } from 'typeorm-seeding'
import { Connection } from 'typeorm'
import { Administrator, User, Contact, Ticket, TicketCollaborator } from '../app/models';
import {
  ContactDetailType,
  SourceType,
  TicketType,
  TicketSeverity,
  TicketStatus,
} from '@titl-all/shared/dist/enum';


export default class AddTicketData implements Seeder {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  public async run(_factory: Factory, connection: Connection): Promise<any> {
    // create tickets and assign every single titl admin employee to the ticket
    // so it can be checked by everyone
    const adminUsers = await connection.createQueryBuilder()
      .from(Administrator, 'admin')
      .innerJoin('admin.user', 'user')
      .select(['admin.userId'])
      .getRawMany()

    const phoneNumber = 772457925;
    const { userid } = await connection.createQueryBuilder()
      .select([
        'users.id as userid'
      ])
      .from(Contact, 'contact')
      .innerJoin('contact.contactDetails', 'contactDetail')
      .leftJoinAndSelect(User, 'users', 'users.contactId = contact.id')
      .where('contactDetail.contactDetailType = :type', { type: ContactDetailType.phone })
      .andWhere('contactDetail.contactDetailValue = :value', { value: phoneNumber })
      .getRawOne();

    const insert = await connection
      .createQueryBuilder()
      .insert()
      .into(Ticket)
      .values([
        {
          // use a differet user id
          user: userid,
          sourceType: SourceType.contact,
          sourceTypeId: userid,
          ticketType: TicketType.reqservice,
          body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Legimus tamen Diogenem, Antipatrum, Mnesarchum, Panaetium, multos alios in primisque familiarem nostrum Posidonium. A mene tu? Atqui iste locus est, Piso, tibi etiam atque etiam confirmandus, inquam; Nec lapathi suavitatem acupenseri Galloni Laelius anteponebat, sed suavitatem ipsam neglegebat; Hoc ille tuus non vult omnibusque ex rebus voluptatem quasi mercedem exigit.',
          severity: TicketSeverity.high,
          status: TicketStatus.pendingunread,
          collaborators: adminUsers,
        },
      ])
      .returning('id')
      .execute();

      const ticketId = insert.raw[0].id;

      for (const adminUser of adminUsers) {
        await connection
        .createQueryBuilder()
        .insert()
        .into(TicketCollaborator)
        .values([
          {
            readOnly: true,
            user: adminUser.userId,
            ticket: ticketId,
          },
        ])
        .execute();
      }

    //const sourceType = SourceType.contact;
    //const sourceTypeId = ; // contact id
  }
}
