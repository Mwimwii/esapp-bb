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

    @Column('varchar', { length: 50, nullable: true })
    country: string;

    @Column('varchar', { length: 50, nullable: true })
    region: string;

    @Column('varchar', { length: 50, nullable: true })
    district: string;

    @Column('varchar', { length: 50, nullable: true })
    county: string;

    @Column('varchar', { length: 50, nullable: true })
    subcounty: string;

    @ManyToOne(() => Contact)
    owner: Contact;

    @OneToMany(() => Property, property => property.propertyGroup)
    properties: Property[];
}