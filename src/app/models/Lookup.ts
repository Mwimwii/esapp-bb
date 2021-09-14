import { Column, Entity } from 'typeorm';
import { BaseTable } from './BaseTable';

@Entity()
export class Lookup extends BaseTable {
    @Column()
    category: string;

    @Column()
    description: string;

    @Column()
    value: string;

    @Column()
    dataType: string;
}