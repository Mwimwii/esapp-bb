import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User, Contact } from '.';
import { BaseTable } from './BaseTable';
import { AssetType } from '@titl-all/shared/dist/enum';

@Entity({ name: 'assets' })
export class Asset extends BaseTable {

  @Column('varchar', { length: 255, nullable: true })
  name: string;

  @Column({ type: 'enum', enum: AssetType })
  type: AssetType;

  @Column('varchar', { length: 255, nullable: true })
  path: string;

  @Column('varchar', { length: 255, nullable: true })
  bucket: string;

  @JoinColumn()
  @ManyToOne(() => Contact)
  ownedBy: Contact;

  @JoinColumn()
  @ManyToOne(() => User)
  uploadedBy: User;
}
