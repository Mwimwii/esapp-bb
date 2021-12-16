import { Factory, Seeder } from 'typeorm-seeding'
import { Connection } from 'typeorm'
//import { User, Ticket } from '../app/models';

export default class RemoveTicketData implements Seeder {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  public async run(_factory: Factory, _connection: Connection): Promise<any> {
  }
}
