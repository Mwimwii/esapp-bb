/* eslint-disable arrow-parens */
import {
  Entity,
  Column,
  Generated,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { User, Camp } from '.';
import { BaseTable } from './BaseTable';
import { CampOfficerAPI } from '../types';


@Entity({ name: 'camp_officers' })
export class CampOfficer extends BaseTable implements CampOfficerAPI {

  @Column('varchar', { length: 50, nullable: true })
  empId: string;

  @Column('varchar', { length: 50, nullable: true })
  firstName: string;

  @Column('varchar', { length: 50, nullable: true })
  lastName: string;

  @JoinColumn()
  @ManyToOne(() => Camp)
  camp: Camp;

  @JoinColumn()
  @OneToOne(() => User)
  user: User;

  @Column({ nullable: true })
  @Generated('uuid')
  uuid: string;

}
