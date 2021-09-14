import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Contact } from './Contact';
import { PropertyGroup } from './PropertyGroup';
import { BaseTable } from './BaseTable';

@Entity()
export class Property extends BaseTable {
    @ManyToOne(() => PropertyGroup, propertyGroup => propertyGroup.properties)
    propertyGroup: PropertyGroup;

    @OneToOne(() => Contact)
    @JoinColumn()
    owner: Contact;

    @OneToOne(() => Property)
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

    @OneToOne(() => Contact)
    @JoinColumn()
    lC: Contact;

    @Column('varchar', { length: 50 })
    nickname: string;

    @Column('varchar', { length: 50 })
    propertyType: string;

    @Column('int')
    sizeSqf: number;

    @Column('varchar', { length: 50 })
    geospatial: string;

    @OneToOne(() => Contact)
    @JoinColumn()
    representative: Contact;

    @Column()
    inConflict: boolean;
}