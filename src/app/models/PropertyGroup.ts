import { Column, Entity, ManyToOne, Generated, OneToMany } from 'typeorm';
import { Contact, Property } from '.';
import { BaseTable } from './BaseTable';
import { PropertyType } from '@titl-all/shared/dist/enum';
import { PropertyGroupAPI } from '@titl-all/shared/dist/api-model';

@Entity({ name: 'property_groups' })
export class PropertyGroup extends BaseTable implements PropertyGroupAPI {
    @Column({ nullable: true })
    @Generated('uuid')
    uuid: string;

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
