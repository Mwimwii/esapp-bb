import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User, Ticket } from '.';
import { BaseTable } from './BaseTable';

@Entity({ name: 'ticket_collaborators' })
export class TicketCollaborator extends BaseTable {
    @ManyToOne(() => User)
    @JoinColumn()
    user: User;

    @ManyToOne(() => Ticket)
    @JoinColumn()
    ticket: Ticket;

    @Column({ default: true })
    readOnly: boolean;
}
