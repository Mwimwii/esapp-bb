import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tokens' })
export class ApiToken extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  entity: string;

  @Column({ unique: true })
  token: string;

  @Column({ type: 'timestamp', nullable: true })
  lastAccessedAt: string;
}
