import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Agreement } from './Agreement';
import { Contact } from './Contact';
import { Property } from './Property';
import { BaseTable } from './BaseTable';


@Entity()
export class Relationship extends BaseTable {
    @JoinColumn()
    @ManyToOne(() => Contact)
    referred: Contact;

    @JoinColumn()
    @ManyToOne(() => Contact)
    referrer: Contact;

    @JoinColumn()
    @ManyToOne(() => Agreement)
    agreement: Agreement;

    @JoinColumn()
    @ManyToOne(() => Property)
    property: Property;

    @Column()
    presentWhenArrived: boolean;

    @Column()
    immediateNeighbor: boolean;

    @Column()
    knewAsLandLord: boolean;
}