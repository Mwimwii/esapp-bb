import { File } from '@foal/storage';
import { User } from 'app/models';


export class TicketService {
  async create(fields: any, image: File, user: User) {
    // TODO
    console.log(fields, image, user);
  }

  async update(uuid: string, fields: any, image: File, user: User) {
    // TODO
    console.log(uuid, fields, image, user);
  }

}
