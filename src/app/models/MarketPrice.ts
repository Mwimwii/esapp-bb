/* eslint-disable arrow-parens */
import {
  Entity,
  Column,
} from 'typeorm';

import { BaseTable } from './BaseTable';
import { MarketPriceAPI } from '../types';


@Entity({ name: 'market_prices' })
export class MarketPrice extends BaseTable implements MarketPriceAPI {

  @Column('float', { nullable: true })
  price: number;

  @Column('varchar', { length: 50, nullable: true })
  unit: string;

  @Column('varchar', { length: 50, nullable: true })
  commodity_type: string;

  @Column('varchar', { length: 50, nullable: true })
  price_level: string;

  @Column('varchar', { length: 50, nullable: true })
  market: string;
}
