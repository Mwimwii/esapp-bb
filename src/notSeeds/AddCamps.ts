import { Factory, Seeder } from 'typeorm-seeding'
import { Connection } from 'typeorm'
import { Camp } from '../app/models';

export default class AddCamps implements Seeder {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  public async run(_factory: Factory, connection: Connection): Promise<any> {
    const camps = [
      {
        name: 'one',
        longitude: 123,
        latitude: 456,
      },
      {
        name: 'two',
        longitude: 123,
        latitude: 456,
      },
      {
        name: 'three',
        longitude: 123,
        latitude: 456,
      },
    ]

    for (const camp of camps) {
      const { name, longitude, latitude } = camp;
      await connection
        .createQueryBuilder()
        .insert()
        .into(Camp)
        .values([
          { name: name, longitude: longitude, latitude: latitude },
        ])
        .execute()
    }
  }
}
