import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Generated,
  CreateDateColumn,
} from 'typeorm';
import {  UserAPI } from '../types';

import { CampOfficer } from '.';

@Entity({ name: 'users' })
export class User extends BaseEntity implements UserAPI {
  fields() {
    return {
      email: this.email,
      camp_officer: this.camp_officer,
      lastLogin: this.lastLogin,
    }
  }

  @Column({ nullable: true })
  @Generated('uuid')
  uuid: string;

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @JoinColumn()
  @OneToOne(() => CampOfficer)
  camp_officer: CampOfficer;

  @Column('timestamp')
  @CreateDateColumn()
  createdAt: string = new Date().toISOString();

  @Column({ type: 'timestamp', nullable: true })
  lastLogin: string;
}

export { DatabaseSession } from '@foal/typeorm';
