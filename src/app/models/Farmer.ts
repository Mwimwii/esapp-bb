/* eslint-disable arrow-parens */
import {
  Entity,
  Column,
  Generated,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { Faabs } from '.'
import { BaseTable } from './BaseTable';
import { FarmerAPI } from 'app/types';

@Entity({ name: 'farmers' })
export class Farmer extends BaseTable implements FarmerAPI {

  @ManyToOne(() => Faabs, { nullable: true })
  @JoinColumn()
  faabsGroup: Faabs;

  @Column('varchar', { length: 50, nullable: true })
  firstName: string;

  @Column('varchar', { length: 50, nullable: true })
  otherNames: string;

  @Column('varchar', { length: 50, nullable: true })
  lastName: string;

  @Column('varchar', { length: 50, default: 'O' })
  sex: string;

  @Column('varchar', { length: 150, nullable: true })
  dob: string;

  @Column('varchar', { length: 50, nullable: true })
  nrc: string;

  @Column('varchar', { nullable: true })
  maritalStatus: string;

  @Column('varchar', { length: 50, nullable: true })
  contactNumber: string;

  @Column('varchar', { length: 50, nullable: true })
  relationshipToHouseholdHead: string;

  @Column('varchar', { length: 50, nullable: true })
  registrationDate: string;

  @Column('int', { nullable: true })
  status: number;

  @Column('int', { nullable: true })
  householdSize: number;

  @Column('varchar', { length: 50, nullable: true })
  village: string;

  @Column('varchar', { length: 50, nullable: true })
  householdHeadType: string;

  @Column('varchar', { length: 50, nullable: true })
  chiefdom: string;

  @Column('varchar', { length: 50, nullable: true })
  block: string;

  @Column('varchar', { length: 50, nullable: true })
  zone: string;

  @Column('varchar', { length: 50, nullable: true })
  commodity: string;

  @Column('varchar', { length: 50, nullable: true })
  title: string;

  @Column('int', { nullable: true })
  age: number;

  @Column({ nullable: true })
  @Generated('uuid')
  uuid: string;

  @Column('float', { nullable: true })
  longitude: number;

  @Column('float', { nullable: true })
  latitude: number;

}
