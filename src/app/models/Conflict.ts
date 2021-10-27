import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseTable } from './BaseTable';
import { Property } from './Property';


@Entity({ name: 'conflicts' })
export class Conflict extends BaseTable {
    @ManyToOne(() => Property, property => property.conflicts)
    property: Property;

    @Column({ type: 'simple-array' })
    conflictType: string[];

    @Column('text')
    confilctDescription: string;

    @Column('boolean', { default: false })
    resolved: boolean;
}
