import { PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, BaseEntity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '.';

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

    //Remove after migration
    @Column({ nullable: true, unique: true })
    airTableId: string;

    @Column({ nullable: true })
    airTableParentId: string;
}