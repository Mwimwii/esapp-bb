import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Contact } from '.';
import { BaseTable } from './BaseTable';
import { SourceType } from '../enums/SourceType';
import { TicketType } from '../enums/TicketType';
import { TicketSeverity } from '../enums/TicketSeverity';
import { TicketStatus } from '../enums/TicketStatus';


@Entity()
export class Ticket extends BaseTable {
    @ManyToOne(() => Contact)
    @JoinColumn()
    contact: Contact;

    @Column({ type: 'enum', enum: SourceType })
    sourceType: SourceType;

    // TODO need table index?
    @Column('int')
    sourceTypeId: number;

    @Column({ type: 'enum', enum: TicketType })
    ticketType: TicketType;

    @Column()
    body: string;

    @Column()
    resolution: string;

    @Column('date')
    dueDate: Date;

    @Column({ type: 'enum', enum: TicketSeverity })
    severity: TicketSeverity;

    @ManyToOne(() => Contact)
    @JoinColumn()
    internalAssignee: Contact;

    @Column({ type: 'enum', enum: TicketStatus })
    status: TicketStatus;

}
