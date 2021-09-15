import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Contact } from './Contact';
import { BaseTable } from './BaseTable';
import { SourceType } from 'app/enums/SourceType';
import { TicketType } from 'app/enums/TicketType';
import { TicketSeverity } from 'app/enums/TicketSeverity';
import { TicketStatus } from 'app/enums/TicketStatus';


@Entity()
export class Ticket extends BaseTable {
    @ManyToOne(() => Contact)
    @JoinColumn()
    contact: Contact;

    @Column()
    sourceType: SourceType;

    @Column('int')
    sourceTypeId: number;

    @Column()
    ticketType: TicketType;

    @Column()
    body: string;

    @Column()
    resolution: string;

    @Column('date')
    dueDate: Date;

    @Column()
    severity: TicketSeverity;

    @ManyToOne(() => Contact)
    @JoinColumn()
    internalAssignee: Contact;

    @Column()
    status: TicketStatus;

}