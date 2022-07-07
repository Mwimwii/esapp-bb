/* eslint-disable arrow-parens */
import {
  Entity,
  Column,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { BaseTable } from './BaseTable';
import { CommodityAPI } from '../types';
import { MarketPrice } from '.';

@Entity({ name: 'commodities' })
export class Commodity extends BaseTable implements CommodityAPI {

  @Column('float', { nullable: true })
  name: string;

  @Column('float', { nullable: true })
  density: number;

  @OneToMany(() => MarketPrice, (market_price) => market_price.commodity,{
    cascade: true
  })
  @JoinColumn()
  market_prices: MarketPrice[];
}
