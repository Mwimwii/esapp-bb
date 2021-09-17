import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Contact } from './Contact';
import { PropertyGroup } from './PropertyGroup';
import { BaseTable } from './BaseTable';
import { PropertyType } from '../enums/PropertyType';
import { PropertyStatus } from '../enums/PropertyStatus';

@Entity()
export class Property extends BaseTable {
    @ManyToOne(() => PropertyGroup, propertyGroup => propertyGroup.properties)
    propertyGroup: PropertyGroup;

    @ManyToOne(() => Contact)
    @JoinColumn()
    owner: Contact;

    @ManyToOne(() => Property)
    @JoinColumn()
    parent: Property;

    @Column('varchar', { length: 50 })
    parish: string;

    @Column('varchar', { length: 50 })
    village: string;

    @Column('varchar', { length: 50 })
    blockNo: string;

    @Column('varchar', { length: 50 })
    plotNo: string;

    @ManyToOne(() => Contact)
    @JoinColumn()
    lC: Contact;

    @Column('varchar', { length: 50 })
    nickname: string;

    @Column({ type: 'enum', enum: PropertyType })
    propertyType: PropertyType;

    @Column('int')
    sizeSqf: number;

    @Column('varchar', { length: 50 })
    geospatial: string;

    @ManyToOne(() => Contact)
    @JoinColumn()
    representative: Contact;

    @Column()
    inConflict: boolean;

    @Column({ type: 'enum', enum: PropertyStatus })
    status: PropertyStatus;
}