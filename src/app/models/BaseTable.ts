import { PrimaryGeneratedColumn, Column, CreateDateColumn, BaseEntity } from 'typeorm';

export abstract class BaseTable extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('timestamp')
  @CreateDateColumn()
  createdAt: string = new Date().toISOString();

}