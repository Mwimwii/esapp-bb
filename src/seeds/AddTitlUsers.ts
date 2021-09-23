import { Factory, Seeder } from 'typeorm-seeding'
import { Connection } from 'typeorm'
import { hashPassword } from '@foal/core';
import { User } from '../app/models';

export default class AddTitlUsers implements Seeder {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  public async run(_factory: Factory, connection: Connection): Promise<any> {
    const extension = '@titl.app';

    const emails = [
      `khaliq${extension}`,
      `zachary${extension}`,
      `benjamin${extension}`,
      `ham${extension}`,
      `isaac${extension}`,
      `patrick${extension}`,
      `sandra${extension}`,
    ];

    const defaultPassword = process.env.DEFAULT_PASSWORD || 'password';

    for (const email of emails) {
      await connection
        .createQueryBuilder()
        .insert()
        .into(User)
        .values([
          { email, password: await hashPassword(defaultPassword) },
        ])
        .execute()
    }
  }
}
