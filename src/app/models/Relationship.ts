import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Agreement } from './Agreement';
import { Contact } from './Contact';
import { Property } from './Property';
import { BaseTable } from './BaseTable';


@Entity()
export class Relationship extends BaseTable {
    @JoinColumn()
    @OneToOne(() => Contact)
    referred: Contact;

    @JoinColumn()
    @OneToOne(() => Contact)
    referrer: Contact;

    @JoinColumn()
    @OneToOne(() => Agreement)
    agreement: Agreement;

    @JoinColumn()
    @OneToOne(() => Property)
    property: Property;

    @Column()
    presentWhenArrived: boolean;

    @Column()
    immediateNeighbor: boolean;

    @Column()
    knewAsLandLord: boolean;
}