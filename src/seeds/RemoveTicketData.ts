import { Factory, Seeder } from 'typeorm-seeding'
import { Connection } from 'typeorm'
import { User, Ticket, Contact, TicketCollaborator } from '../app/models';
import {
  ContactDetailType,
} from '@titl-all/shared/dist/enum';

export default class RemoveTicketData implements Seeder {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  public async run(_factory: Factory, connection: Connection): Promise<any> {
    const phoneNumber = 772457925;

    const internalAssigneeEmail = 'benjamin@titl.app';

    const { id: internalAssigneeUserId } = await connection.createQueryBuilder()
      .select([
        'id'
      ])
      .from(User, 'users')
      .where('email = :email', { email:  internalAssigneeEmail })
      .getRawOne();

    const ticketUser = 'ham@titl.app';

    const { id: ticketUserId } = await connection.createQueryBuilder()
      .select([
        'id'
      ])
      .from(User, 'users')
      .where('email = :email', { email:  ticketUser })
      .getRawOne();

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

    const tickets = await connection.createQueryBuilder()
      .select(['id'])
      .from(Ticket, 'ticket')
      .where('ticket.sourceTypeId = :sourceTypeId', { sourceTypeId: userid })
      .andWhere('ticket.internalAssignee = :internalAssignee', { internalAssignee: internalAssigneeUserId })
      .andWhere('ticket.body = :body', { body: 'TEST TICKET: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Legimus tamen Diogenem, Antipatrum, Mnesarchum, Panaetium, multos alios in primisque familiarem nostrum Posidonium. A mene tu? Atqui iste locus est, Piso, tibi etiam atque etiam confirmandus, inquam; Nec lapathi suavitatem acupenseri Galloni Laelius anteponebat, sed suavitatem ipsam neglegebat; Hoc ille tuus non vult omnibusque ex rebus voluptatem quasi mercedem exigit.' })
      .andWhere('ticket.user = :user', { user: ticketUserId })
      .execute();

      for (const ticket of tickets) {
        await connection
        .createQueryBuilder()
        .delete()
        .from(TicketCollaborator)
        .where('ticket = :ticket', { ticket: ticket.id })
        .execute();

        await connection
        .createQueryBuilder()
        .delete()
        .from(Ticket)
        .where('id = :id', { id: ticket.id })
        .execute();

      }
  }
}
