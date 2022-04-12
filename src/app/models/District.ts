/* eslint-disable arrow-parens */
import {
  Entity,
  Column,
  OneToMany,
  Generated,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Camp , Province } from '.';
import { BaseTable } from './BaseTable';

import { DistrictAPI } from '../types/';

@Entity({ name: 'districts' })
export class District extends BaseTable implements DistrictAPI {

  @Column('varchar', { length: 50, nullable: true })
  name: string;

  @Column('varchar', { length: 50, nullable: true })
  code: string;

  @OneToMany(() => Camp, (camp) => camp.district, {
    cascade: true,
  })
  @JoinColumn()
  camps: Camp[];

  @JoinColumn()
  @ManyToOne(() => Province)
  province: Province;

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
