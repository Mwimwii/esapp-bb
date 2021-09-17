import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Contact } from './Contact';

@Entity()
export class User extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @JoinColumn()
  @OneToOne(() => Contact)
  contact: Contact;
}

export { DatabaseSession } from '@foal/typeorm';
