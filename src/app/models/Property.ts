import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Agreement, Conflict, Contact, PropertyGroup } from '.';
import { BaseTable } from './BaseTable';
import { PropertyType } from '../enums/PropertyType';
import { PropertyStatus } from '../enums/PropertyStatus';
import { MeasurementType } from '../enums/MeasurementType';

@Entity({ name: 'properties' })
export class Property extends BaseTable {
    @ManyToOne(() => PropertyGroup, propertyGroup => propertyGroup.properties)
    propertyGroup: PropertyGroup;

    @ManyToOne(() => Contact)
    @JoinColumn()
    owner: Contact;

    @ManyToOne(() => Property)
    @JoinColumn()
    parent: Property;

    @Column('varchar', { length: 50, nullable: true })
    parish: string;

    @Column('varchar', { length: 50, nullable: true })
    village: string;

    @Column('varchar', { length: 50, nullable: true })
    blockNo: string;

    @Column('varchar', { length: 50, nullable: true })
    plotNo: string;

    @ManyToOne(() => Contact, { cascade: true })
    @JoinColumn()
    lC: Contact;

    @Column('varchar', { length: 50, nullable: true })
    nickname: string;

    @Column({ type: 'enum', enum: PropertyType })
    propertyType: PropertyType;

    @Column('varchar', { length: 25, nullable: true })
    sizeSqf: string;

    @Column({ type: 'enum', enum: MeasurementType, default: MeasurementType.sqft, nullable: true })
    sizeUnit: MeasurementType;

    @Column('varchar', { length: 50, nullable: true })
    geospatial: string;

    @ManyToOne(() => Contact)
    @JoinColumn()
    representative: Contact;

    @Column({ default: false })
    inConflict: boolean;

    @Column({ type: 'enum', enum: PropertyStatus })
    status: PropertyStatus;

    @OneToMany(() => Agreement, agreement => agreement.property, { cascade: true })
    agreements: Agreement[];

    @OneToMany(() => Conflict, conflict => conflict.property, { cascade: true })
    conflicts: Conflict[];
}