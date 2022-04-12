/* eslint-disable arrow-parens */
import {
  Entity,
  Column,
  OneToMany,
  Generated,
  JoinColumn,
} from 'typeorm';
import { District } from '.';

import { BaseTable } from './BaseTable';
import { ProvinceAPI } from '../types';



@Entity({ name: 'provinces' })
export class Province extends BaseTable implements ProvinceAPI {

  @Column('varchar', { length: 50, nullable: true })
  name: string;

  @Column('varchar', { length: 50, nullable: true })
  code: string;

  @OneToMany(() => District, (district) => district.province, {
    cascade: true,
  })
  @JoinColumn()
  districts: District[];

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
