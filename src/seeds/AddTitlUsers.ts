import { Factory, Seeder } from 'typeorm-seeding'
import { Connection } from 'typeorm'
import { hashPassword } from '@foal/core';
import { User, Administrator } from '../app/models';

export default class AddTitlUsers implements Seeder {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  public async run(_factory: Factory, connection: Connection): Promise<any> {
    const extension = '@titl.app';

    const admins = [
      {
        email: `khaliq${extension}`,
        firstName: 'Khaliq',
        lastName: 'Gant',
        team: 'engineering'
      },
      {
        email: `zachary${extension}`,
        firstName: 'Zachary',
        lastName: 'Mugabi',
        team: 'management',
      },
      {
        email: `benjamin${extension}`,
        firstName: 'Benjamin',
        lastName: 'Øien',
        team: 'management',
      },
      {
        email: `ham${extension}`,
        firstName: 'Ham',
        lastName: 'Lubega',
        team: 'truesoil',
      },
      {
        email: `isaac${extension}`,
        firstName: 'Isaac',
        lastName: 'Obote',
        team: 'engineering'
      },
      {
        email: `patrick${extension}`,
        firstName: 'Patrick',
        lastName: 'Kahango',
        team: 'truesoil',
      },
      {
        email: `sandra${extension}`,
        firstName: 'Sandra',
        lastName: 'Nanteza',
        team: 'truesoil',
      },
    ]

    const defaultPassword = process.env.DEFAULT_PASSWORD || 'password';

    for (const admin of admins) {
      const { email, firstName, lastName, team } = admin;
      const insertedUser = await connection
        .createQueryBuilder()
        .insert()
        .into(User)
        .values([
          { email, password: await hashPassword(defaultPassword) },
        ])
        .execute()

        const [userId] = insertedUser.identifiers;

        await connection
        .createQueryBuilder()
        .insert()
        .into(Administrator)
        .values([
          { firstName, lastName, team, user: userId },
        ])
        .execute()
    }
  }
}
