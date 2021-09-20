import { Entity, Column, OneToMany, Generated } from 'typeorm';
import { ContactDetail } from '.';
import { BaseTable } from './BaseTable';
import { Identification } from './Identification';
import { ContactStatus } from '../enums/ContactStatus';
import { ContactType } from '../enums/ContactType';

@Entity()
export class Contact extends BaseTable {
  @Column('varchar', { length: 50, nullable: true })
  firstName: string;

  @Column('varchar', { length: 50, nullable: true })
  lastName: string;

  @Column('varchar', { length: 2, default: 'O' })
  gender: string;

  @Column({ nullable: true })
  @Generated('uuid')
  uuid: string;

  @Column({
    type: 'date',
    nullable: true,
  })
  dob: Date;

  @Column({
    type: 'int',
    nullable: true,
  })
  age: number;

  @Column({ type: 'enum', enum: ContactType })
  type: ContactType;

  @Column('simple-array', { default: ['en'] })
  languages: string[];

  @OneToMany(() => ContactDetail, contactDetail => contactDetail.contact, { cascade: true })
  contactDetails: ContactDetail[];

  @OneToMany(() => Identification, identification => identification.contact, { cascade: true })
  identifications: Identification[];

  @Column({ type: 'enum', enum: ContactStatus, default: ContactStatus.active })
  status: ContactStatus;
}
