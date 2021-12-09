import { Entity, Column, OneToMany, Generated, JoinColumn, ManyToOne } from 'typeorm';
import { ContactDetail, Asset, Comment } from '.';
import { BaseTable } from './BaseTable';
import { Identification } from './Identification';
import { PropertyGroup } from './PropertyGroup';
import { ContactStatus, ContactType, Language } from '@titl-all/shared/dist/enum';
import { ContactAPI } from '@titl-all/shared/dist/api-model';

@Entity({ name: 'contacts' })
export class Contact extends BaseTable implements ContactAPI {
  fields() {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      gender: this.gender,
      uuid: this.uuid,
      dob: this.dob,
      age: this.age,
      contactType: this.contactType,
      languages: this.languages,
      contactDetails: this.contactDetails,
      identifications: this.identifications,
      status: this.status,
      lastModifiedDate: this.modifiedAt,
      hubSpotId: this.hubSpotId,
    }
  }

  @Column('varchar', { length: 50, nullable: true })
  firstName: string;

  @Column('varchar', { length: 50, nullable: true })
  lastName: string;

  @Column('varchar', { length: 50, nullable: true })
  nickName: string;

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
  contactType: ContactType;

  @Column({ default: false })
  hasPicture: boolean;

  @Column('simple-array', { default: 'en' })
  languages: Language[];

  @ManyToOne(() => Contact)
  @JoinColumn()
  parentSpouse: Contact;

  @OneToMany(() => ContactDetail, contactDetail => contactDetail.contact, { cascade: true })
  contactDetails: ContactDetail[];

  @OneToMany(() => Identification, identification => identification.contact, { cascade: true })
  identifications: Identification[];

  @OneToMany(() => PropertyGroup, propertyGroup => propertyGroup.owner, { cascade: true })
  propertyGroups: PropertyGroup[];

  @OneToMany(() => Contact, contact => contact.parentSpouse, { cascade: true })
  spouses: Contact[];

  @Column({ type: 'enum', enum: ContactStatus, default: ContactStatus.active })
  status: ContactStatus;

  @OneToMany(() => Asset, ((asset: Asset) => asset.ownedBy), { cascade: true })
  assets: Asset[];

  @OneToMany(() => Comment, ((comment: Comment) => comment.contact), { cascade: true })
  comments: Comment[];
}
