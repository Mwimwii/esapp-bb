import { Seeder } from '@jorgebodega/typeorm-seeding'
import { Connection } from 'typeorm'
import { hashPassword } from '@foal/core';
import { User, CampOfficer } from '../app/models';

export default class AddEsappUsers extends Seeder {
  private admins = [
    {
      email: 'admin@e-sapp.gov.zm',
      firstName: 'Admin',
      lastName: 'User',
      password: 'password'
    },
  ]

  async run(connection: Connection): Promise<any> {
    for (const admin of this.admins) {
      const { email, firstName, lastName, password } = admin;
      const insertedUser = await connection
        .createQueryBuilder()
        .insert()
        .into(User)
        .values([
          { email, password: await hashPassword(password) },
        ])
        .execute()

        const [userId] = insertedUser.identifiers;

        await connection
        .createQueryBuilder()
        .insert()
        .into(CampOfficer)
        .values([
          { firstName, lastName, user: userId, empId: '12345' },
        ])
        .execute()
    }
  }
}
