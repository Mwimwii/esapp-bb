import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Contact } from './Contact';
import { BaseTable } from './BaseTable';


@Entity()
export class Ticket extends BaseTable {
    @OneToOne(() => Contact)
    @JoinColumn()
    contact: Contact;

    @Column()
    sourceType: string;

    @Column('int')
    sourceTypeId: number;

    @Column()
    ticketType: string;

    @Column()
    body: string;

    @Column()
    resolution: string;

    @Column('date')
    dueDate: Date;

    @Column()
    severity: string;

    @OneToOne(() => Contact)
    @JoinColumn()
    internalAssignee: Contact;

}