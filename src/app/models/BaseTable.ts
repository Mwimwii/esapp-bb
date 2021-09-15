import { PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, BaseEntity, JoinColumn } from 'typeorm';
import { User } from '.';

export abstract class BaseTable extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', { length: 50})
    status: string;

    @Column('timestamp')
    @CreateDateColumn()
    createdAt: string = new Date().toISOString();

    @JoinColumn()
    @Column(() => User)
    createdBy: User;

    @Column('timestamp')
    @UpdateDateColumn()
    modifiedAt: string = new Date().toISOString();

    @JoinColumn()
    @Column(() => User)
    modifiedBy: User;
}