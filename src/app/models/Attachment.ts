import { AttachmentStatus } from 'app/enums/AttachmentStatus';
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

    @Column()
    status: AttachmentStatus;
}
