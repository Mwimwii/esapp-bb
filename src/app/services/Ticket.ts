import { File } from '@foal/storage';
import { User, Ticket } from 'app/models';


export class TicketService {
  async getAll(user: User): Promise<Ticket[] | undefined> {
    const tickets = await Ticket.find({
      where: {
        user: user.id,
      }
      // or sourceType = user|contact
      // https://github.com/titl-all/shared/blob/main/src/enums/SourceType.ts
    });

    return tickets;
  }

  async get(user: User, ticketUuid: string): Promise<Ticket | undefined> {
    const ticket = await Ticket.findOne({
      where: {
        user: user.id,
        uuid: ticketUuid,
      }
    });

    return ticket;
  }

  async create(fields: any, image: File, user: User) {
    // TODO
    console.log(fields, image, user);
  }

  async update(uuid: string, fields: any, image: File, user: User) {
    // TODO
    console.log(uuid, fields, image, user);
  }

}
