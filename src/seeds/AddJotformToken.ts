import { Factory, Seeder } from 'typeorm-seeding'
import { Connection } from 'typeorm'
import { ApiToken } from '../app/models/ApiToken';

export default class AddJotformToken implements Seeder {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  public async run(_factory: Factory, connection: Connection): Promise<any> {
    const token = process.env.JOTFORM_API_KEY || 'mDVE9BVWBm2f8bkcTH';

    await connection
      .createQueryBuilder()
      .insert()
      .into(ApiToken)
      .values([
        { entity: 'Jotform', token },
      ])
      .execute()
  }
}
