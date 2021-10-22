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
        team: 'engineering',
        superadmin: true,
      },
      {
        email: `zachary${extension}`,
        firstName: 'Zachary',
        lastName: 'Mugabi',
        team: 'management',
        superadmin: true,
      },
      {
        email: `benjamin${extension}`,
        firstName: 'Benjamin',
        lastName: 'Øien',
        team: 'management',
        superadmin: true,
      },
      {
        email: `ham${extension}`,
        firstName: 'Ham',
        lastName: 'Lubega',
        team: 'truesoil',
        superadmin: false,
      },
      {
        email: `isaac${extension}`,
        firstName: 'Isaac',
        lastName: 'Obote',
        team: 'engineering',
        superadmin: false,
      },
      {
        email: `patrick${extension}`,
        firstName: 'Patrick',
        lastName: 'Kahango',
        team: 'truesoil',
        superadmin: false,
      },
      {
        email: `sandra${extension}`,
        firstName: 'Sandra',
        lastName: 'Nanteza',
        team: 'truesoil',
        superadmin: false,
      },
      {
        email: `victor${extension}`,
        firstName: 'Victor',
        lastName: 'Lubanga',
        team: 'truesoil',
        superadmin: false,
      },
      {
        email: `edith${extension}`,
        firstName: 'Edith',
        lastName: 'Ndagire',
        team: 'truesoil',
        superadmin: false,
      },
      {
        email: `olwenyi${extension}`,
        firstName: 'Olwenyi',
        lastName: 'Ronald',
        team: 'truesoil',
        superadmin: false,
      },
    ]

    const defaultPassword = process.env.DEFAULT_PASSWORD || 'password';

    for (const admin of admins) {
      const { email, firstName, lastName, team, superadmin } = admin;
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
          { firstName, lastName, team, user: userId, superadmin },
        ])
        .execute()
    }
  }
}
