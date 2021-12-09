import { Column, Entity, ManyToOne } from 'typeorm';
import { Agreement } from '.';
import { BaseTable } from './BaseTable';

@Entity({ name: 'comments' })
export class Comment extends BaseTable {
    @ManyToOne(() => Agreement, agreement => agreement.comments)
    agreement: Agreement;

    @Column('text')
    comment: string;
}
