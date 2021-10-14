import { AttachmentStatus } from '../enums/AttachmentStatus';
import { Column, Entity } from 'typeorm';
import { BaseTable } from './BaseTable';


@Entity({ name: 'attachments' })
export class Attachment extends BaseTable {
    @Column('int', { nullable: true })
    sourceTypeId: number;

    @Column({ nullable: true })
    sourceType: string;

    @Column()
    filePath: string;

    @Column({ type: 'enum', enum: AttachmentStatus })
    status: AttachmentStatus;
}
