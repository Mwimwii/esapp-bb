import { PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, BaseEntity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './User';

export abstract class BaseTable extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('timestamp')
    @CreateDateColumn()
    createdAt: string = new Date().toISOString();

    @JoinColumn()
    @ManyToOne(() => User)
    createdBy: User;

    @Column('timestamp')
    @UpdateDateColumn()
    modifiedAt: string = new Date().toISOString();

    @JoinColumn()
    @ManyToOne(() => User)
    modifiedBy: User;
}