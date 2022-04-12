import { Factory, Seeder } from 'typeorm-seeding'
import { Connection } from 'typeorm'
import { Province } from '../app/models';

export default class AddProvinces implements Seeder {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  public async run(_factory: Factory, connection: Connection): Promise<any> {
    const provinces = [
      {
        name: 'Lusaka',
        code: 'LSK',
        longitude: 123,
        latitude: 456,
      },
      {
        name: 'Copperbelt',
        code: 'CB',
        longitude: 123,
        latitude: 456,
      },
      {
        name: 'Southern',
        code: 'S',
        longitude: 123,
        latitude: 456,
      },
      {
        name: 'Western',
        code: 'W',
        longitude: 123,
        latitude: 456,
      },
      {
        name: 'Eastern',
        code: 'E',
        longitude: 123,
        latitude: 456,
      }
    ]

    for (const province of provinces) {
      const { name, code, longitude, latitude } = province;
      await connection
        .createQueryBuilder()
        .insert()
        .into(Province)
        .values([
          { name, code, longitude, latitude },
        ])
        .execute()
    }
  }
}
