/* eslint-disable arrow-parens */
import {
  Entity,
  Column,
} from 'typeorm';

import { BaseTable } from './BaseTable';
import { FaabsTopicAPI } from '../types';

@Entity({ name: 'faabs_topics' })
export class FaabsTopic extends BaseTable implements FaabsTopicAPI {

  @Column('text', { nullable: true })
  outputLevelIndicator: string;

  @Column('text', { nullable: true })
  category: string;

  @Column('text', { nullable: true })
  subComponent: string;


}
