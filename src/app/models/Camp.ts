/* eslint-disable arrow-parens */
import {
  Entity,
  Column,
  OneToMany,
  Generated,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Faabs ,District,  CampOfficer  } from '.';
import { BaseTable } from './BaseTable';
import { CampAPI } from '../types';


@Entity({ name: 'camps' })
export class Camp extends BaseTable implements CampAPI {

  @Column('varchar', { length: 50, nullable: true })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @OneToMany(() => Faabs, (faabs) => faabs.camp, {
    cascade: true,
  })
  @JoinColumn()
  faabs: Faabs[];

  @OneToMany(() => CampOfficer, (camp_officer) => camp_officer.camp, {
    cascade: true,
  })
  @JoinColumn()
  camp_officers: CampOfficer[];

  @JoinColumn()
  @ManyToOne(() => District)
  district: District;

  @Column({
    type: 'float',
    nullable: false,
  })
  longitude: number;

  @Column({
    type: 'float',
    nullable: false,
  })
  latitude: number;

  @Column({ nullable: true })
  @Generated('uuid')
  uuid: string;

}
