/* eslint-disable arrow-parens */
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { Faabs, Farmer, FaabsTopic } from '.';
import { BaseTable } from './BaseTable';
import {  FaabsAttendanceAPI } from '../types';


@Entity({ name: 'faabs_attendance' })
export class FaabsAttendance extends BaseTable implements FaabsAttendanceAPI {

  @Column('varchar', { length: 50, nullable: true })
  name: string;

  @Column('varchar', { nullable: true })
  facilitators: string;

  @Column('varchar', { nullable: true })
  partnerOrganisations: string;

  @Column('varchar', { nullable: true })
  trainingDate: string;

  @Column('varchar', { nullable: true })
  trainingType: string;

  @Column('int', { nullable: true })
  duration: number;

  @Column('int', { nullable: true })
  quarter: number;

  @JoinColumn()
  @ManyToOne(() => FaabsTopic)
  topic: FaabsTopic;

  @JoinColumn()
  @ManyToOne(() => Faabs)
  faabsGroup: Faabs;

  @JoinTable()
  @ManyToMany(() => Farmer, (farmer) => farmer.attendance, {})
  farmers: Farmer[];
}
