import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Contact } from '.';

@Entity({ name: 'users' })
export class User extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @JoinColumn()
  @OneToOne(() => Contact)
  contact: Contact;

  @Column('timestamp')
  @CreateDateColumn()
  createdAt: string = new Date().toISOString();

  @Column({ type: 'timestamp', nullable: true })
  lastLogin: string;
}

export { DatabaseSession } from '@foal/typeorm';
