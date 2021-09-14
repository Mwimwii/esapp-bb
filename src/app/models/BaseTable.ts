import { PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, BaseEntity } from 'typeorm';

export abstract class BaseTable extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', { length: 50, default: 'new' })
    status = 'new';

    @Column('timestamp')
    @CreateDateColumn()
    createdAt: string = new Date().toISOString();

    @Column('int')
    createdBy = -1;

    @Column('timestamp')
    @UpdateDateColumn()
    modifiedAt: string = new Date().toISOString();

    @Column('int')
    modifiedBy = -1;
}