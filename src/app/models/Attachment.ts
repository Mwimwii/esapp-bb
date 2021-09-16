import { AttachmentStatus } from '../enums/AttachmentStatus';
import { Column, Entity } from 'typeorm';
import { BaseTable } from './BaseTable';


@Entity()
export class Attachment extends BaseTable {
    @Column('int')
    sourceTypeId: number;

    @Column()
    sourceType: string;

    @Column()
    filePath: string;

    @Column({ type: 'enum', enum: AttachmentStatus })
    status: AttachmentStatus;
}
