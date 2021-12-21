import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  JoinTable,
  OneToMany,
  ManyToMany,
  Generated,
} from 'typeorm';
import { User, TicketCollaborator, Asset } from '.';
import { BaseTable } from './BaseTable';

import {
  SourceType,
  TicketType,
  TicketSeverity,
  TicketStatus,
  TicketResolution,
} from '@titl-all/shared/dist/enum';
import { TicketAPI } from '@titl-all/shared/dist/api-model';


@Entity({ name: 'tickets' })
export class Ticket extends BaseTable implements TicketAPI {
    @Column({ nullable: true })
    @Generated('uuid')
    uuid: string;

    @ManyToOne(() => User)
    @JoinColumn()
    user: User;

    @Column({ type: 'enum', enum: SourceType })
    sourceType: SourceType;

    @Column('int')
    sourceTypeId: number;

    @Column({ type: 'enum', enum: TicketType })
    ticketType: TicketType;

    @Column()
    body: string;

    @Column({ type: 'enum', enum: TicketResolution, nullable: true })
    resolution: TicketResolution;

    @Column({ nullable: true })
    resolutionExplanation: string;

    @Column({ type: 'date', nullable: true })
    dueDate: Date;

    @Column({ type: 'enum', enum: TicketSeverity })
    severity: TicketSeverity;

    @ManyToOne(() => User)
    @JoinColumn()
    internalAssignee: User;

    @Column({ type: 'enum', enum: TicketStatus })
    status: TicketStatus;

    @OneToMany(() => TicketCollaborator, ((collaborator: TicketCollaborator) => collaborator.user), { cascade: true })
    collaborators: TicketCollaborator[];

    @JoinTable()
    @ManyToMany(() => Ticket)
    childTickets: Ticket[];

    @ManyToOne(() => Ticket)
    @JoinColumn()
    parentTicket: Ticket;

    @OneToMany(() => Asset, ((asset: Asset) => asset.ownedByTicket), { cascade: true })
    assets: Asset[];
}
