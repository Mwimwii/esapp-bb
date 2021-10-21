import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from '.';
import { BaseTable } from './BaseTable';

@Entity({ name: 'administrators' })
export class Administrator extends BaseTable {

  @Column('varchar', { length: 50, nullable: true })
  firstName: string;

  @Column('varchar', { length: 50, nullable: true })
  lastName: string;

  @Column('varchar', { length: 50, nullable: true })
  team: string;

  @JoinColumn()
  @OneToOne(() => User, user => user.administrator)
  user: User;
}
