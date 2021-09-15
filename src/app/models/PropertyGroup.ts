import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { Contact } from './Contact';
import { Property } from './Property';
import { BaseTable } from './BaseTable';
import { PropertyType } from 'app/enums/PropertyType';

@Entity()
export class PropertyGroup extends BaseTable {
    @Column('varchar', { length: 50, nullable: true })
    nickname: string;

    @Column()
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

    @OneToOne(() => Contact)
    owner: Contact;

    @OneToMany(() => Property, property => property.propertyGroup)
    properties: Property[];
}