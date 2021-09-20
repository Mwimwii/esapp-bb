import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '.';
import { BaseTable } from './BaseTable';

@Entity()
export class MagicCode extends BaseTable {
    @JoinColumn()
    @ManyToOne(() => User)
    user: User;

    @Column('varchar', { length: 255 })
    token: string;

    @Column('date')
    expiresAt: Date;

    @Column('date')
    usedAt: Date;

    @Column('boolean')
    firstLogin: boolean;
}
