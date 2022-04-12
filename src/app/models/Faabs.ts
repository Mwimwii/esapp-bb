/* eslint-disable arrow-parens */
import {
  Entity,
  Column,
  OneToMany,
  ManyToMany,
  Generated,
  ManyToOne,
  JoinColumn,
  JoinTable,
} from 'typeorm';

import { Camp, Farmer, FaabsTopic, FaabsAttendance } from '.';
import { BaseTable } from './BaseTable';
import { FaabsAPI } from '../types';


@Entity({ name: 'faabs' })
export class Faabs extends BaseTable implements FaabsAPI {

  @Column('varchar', { length: 50, nullable: true })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @JoinTable()
  @ManyToMany(() => FaabsTopic)
  topics: FaabsTopic[];

  @OneToMany(() => FaabsAttendance, (attendance) => attendance.faabsGroup, {
    cascade: true,
  })
  @JoinColumn()
  attendance: FaabsAttendance[];

  @OneToMany(() => Farmer, (farmer) => farmer.faabsGroup, {
    cascade: true,
  })
  @JoinColumn()
  farmers: Farmer[];

  @JoinColumn()
  @ManyToOne(() => Camp)
  camp: Camp;

  @Column({type: 'int', nullable: false,})
  maxAttendedTopics: number;

  @Column({type: 'int', nullable: false,})
  status: number;

  @Column({type: 'float', nullable: false,})
  longitude: number;

  @Column({ type: 'float', nullable: false})
  latitude: number;

  @Column({ nullable: true })
  @Generated('uuid')
  uuid: string;

}
