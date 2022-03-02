import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import {
  User,
  Contact,
  Property,
  Ticket,
  Agreement,
} from '.';
import { BaseTable } from './BaseTable';
import { AssetType } from '@titl-all/shared/dist/enum';

@Entity({ name: 'assets' })
export class Asset extends BaseTable {

  fieldsNoRelations() {
    return {
      name: this.name,
      path: this.path,
      size: this.size,
      bucket: this.bucket,
      type: this.type
    };
  }

  @Column('varchar', { length: 255, nullable: true })
  name: string;

  @Column({ type: 'enum', enum: AssetType })
  type: AssetType;

  @Column('varchar', { length: 255, nullable: true })
  path: string;

  @Column('varchar', { length: 255, nullable: true })
  bucket: string;

  @Column('numeric', { default: 0 })
  size: number;

  @JoinColumn()
  @ManyToOne(() => Contact)
  ownedByContact: Contact;

  @JoinColumn()
  @ManyToOne(() => Property)
  ownedByProperty: Property;

  @JoinColumn()
  @ManyToOne(() => Ticket)
  ownedByTicket: Ticket;

  @JoinColumn()
  @ManyToOne(() => Agreement)
  ownedByAgreement: Agreement;

  @JoinColumn()
  @ManyToOne(() => User)
  uploadedBy: User;
}
