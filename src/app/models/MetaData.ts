import { Column, Entity } from 'typeorm';
import { BaseTable } from './BaseTable';

@Entity()
export class MetaData extends BaseTable {
    @Column()
    sourceType: string;

    @Column()
    sourceTypeId: string;

    @Column()
    notes: string;

    @Column()
    details: string;

    @Column('timestamp')
    sourceDate: Date;
}