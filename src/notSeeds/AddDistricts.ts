import { Factory, Seeder } from 'typeorm-seeding'
import { Connection } from 'typeorm'
import { District } from '../app/models';

export default class AddProvinces implements Seeder {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  public async run(_factory: Factory, connection: Connection): Promise<any> {
    const districts = [
      {
        name: 'Lusaka',
        code: 'LSK',
        province: 'Lusaka',
        longitude: 123,
        latitude: 456,
      },
      {
        name: 'Kitwe',
        code: 'CB',
        province: 'Copperbelt',
        longitude: 123,
        latitude: 456,
      },
      {
        name: 'Livingstone',
        code: 'S',
        province: 'Southern',
        longitude: 123,
        latitude: 456,
      },
    ]

    for (const district of districts) {
      const { name, code, longitude, latitude } = district;
      await connection
        .createQueryBuilder()
        .insert()
        .into(District)
        .values([
          { name, code, longitude, latitude },
        ])
        .execute()


    }
  }
}
