import { Factory, Seeder } from 'typeorm-seeding'
import { Connection } from 'typeorm'
import { Farmer } from '../app/models';

export default class AddFamers implements Seeder {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  public async run(_factory: Factory, connection: Connection): Promise<any> {
    console.log('Adding farmers...');
    const farmers = [
      {
        firstName: 'Francis',
        lastName: 'Chulu',
        sex: 'Male',
        dob: '1990-06-05',
        nrc: '1828672/12/34',
        maritialStatus: 'Married',
        phoneNumber: '+260978981455',
        registrationDate: '2021-03-03',
        status: 10,
        longitude: 1615132100,
        latitude: 1616709828
      },
      {
        firstName: 'Herbert',
        lastName: 'Muyambo',
        sex: 'Male',
        dob: '1990-06-05',
        nrc: '1828672/12/34',
        maritialStatus: 'Single',
        phoneNumber: '+260973941455',
        registrationDate: '2021-03-03',
        status: 10,
        longitude: 1615132100,
        latitude: 1616709903
      },
    ]

    for (const farmer of farmers) {
      console.log('Adding farmer: ', farmer);
      await connection
        .createQueryBuilder()
        .insert()
        .into(Farmer)
        .values([
          {...farmer},
        ])
        .execute()
    }
  }
}
