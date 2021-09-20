import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Contact, Property } from '.';
import { BaseTable } from './BaseTable';
import { PropertyType } from '../enums/PropertyType';

@Entity()
export class PropertyGroup extends BaseTable {
    @Column('varchar', { length: 50, nullable: true })
    nickname: string;

    @Column({ type: 'enum', enum: PropertyType })
    propertyType: PropertyType;

    @Column('varchar', { length: 50 })
    country: string;

    @Column('varchar', { length: 50 })
    region: string;

    @Column('varchar', { length: 50 })
    district: string;

    @Column('varchar', { length: 50 })
    county: string;

    @Column('varchar', { length: 50 })
    subcounty: string;

    @ManyToOne(() => Contact)
    owner: Contact;

    @OneToMany(() => Property, property => property.propertyGroup)
    properties: Property[];
}