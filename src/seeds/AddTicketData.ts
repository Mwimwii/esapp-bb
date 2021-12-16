import { Factory, Seeder } from 'typeorm-seeding'
import { Connection } from 'typeorm'
//import { User, Ticket, Administrator } from '../app/models';
import { Administrator } from '../app/models';
import { SourceType } from '@titl-all/shared/dist/enum';


export default class AddTicketData implements Seeder {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  public async run(_factory: Factory, _connection: Connection): Promise<any> {
    // create tickets and assign every single titl admin employee to the ticket
    // so it can be checked by everyone
    const adminUsers = await Administrator.find({
      relations: ['user']
    });

    // find the contact who that is
    const phoneNumber = 772457925;

    const sourceType = SourceType.contact;
    const sourceTypeId = ; // contact id
  }
}
