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
  
      // New Assignee
      const phoneNumber = 775581321;
  
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
  
      const insert = await connection
        .createQueryBuilder()
        .insert()
        .into(Ticket)
        .values([
          {
            user: ticketUserId,
            sourceType: SourceType.contact,
            sourceTypeId: userid,
            ticketType: TicketType.reqservice,
            internalAssignee: internalAssigneeUserId,
            body: 'Hi! I am requesting to postpone the rental payment of 200,000 UGX for 1 month. Is it acceptable to you?',
            severity: TicketSeverity.high,
            status: TicketStatus.pendingunread,
            collaborators: adminUsers,
          },
          {
            user: ticketUserId,
            sourceType: SourceType.contact,
            sourceTypeId: userid,
            ticketType: TicketType.reqservice,
            internalAssignee: internalAssigneeUserId,
            body: 'Hi! I am requesting consent to sell my Kibanja at Mukono. Is this acceptable to you?',
            severity: TicketSeverity.high,
            status: TicketStatus.pendingunread,
            collaborators: adminUsers,
          },
          {
            user: ticketUserId,
            sourceType: SourceType.contact,
            sourceTypeId: userid,
            ticketType: TicketType.reqservice,
            internalAssignee: internalAssigneeUserId,
            body: 'Hi! This is to inform you that I am cancelling my rental agreement with you as of October 2022.',
            severity: TicketSeverity.high,
            status: TicketStatus.pendingunread,
            collaborators: adminUsers,
          },
        ])
        .returning('id')
        .execute();
  

        //To be refactored
        const ticketId = insert.raw[0].id;
        const ticket2Id = insert.raw[1].id;
        const ticket3Id = insert.raw[2].id;
    
  
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
            {
                readOnly: true,
                user: adminUser.userId,
                ticket: ticket2Id,
              },
              {
                readOnly: true,
                user: adminUser.userId,
                ticket: ticket3Id,
              },
          ])
          .execute();
        }
    }
  }
  