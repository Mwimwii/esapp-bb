import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '.';
import { BaseTable } from './BaseTable';

@Entity({ name: 'ticket_collaborators' })
export class TicketCollaborator extends BaseTable {
    @ManyToOne(() => User)
    @JoinColumn()
    user: User;

    @Column({ default: true })
    readOnly: boolean;
}
