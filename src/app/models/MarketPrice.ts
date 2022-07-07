/* eslint-disable arrow-parens */
import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { BaseTable } from './BaseTable';
import { Commodity, MarketVendor, District } from '.';
import { MarketPriceAPI } from '../types';


@Entity({ name: 'market_prices' })
export class MarketPrice extends BaseTable implements MarketPriceAPI {

  @Column('float', { nullable: true })
  price: number;

  @Column('varchar', { length: 50, nullable: true })
  unit: string;

  @OneToOne(() => Commodity)
  @JoinColumn()
  commodity: Commodity;

  @ManyToOne(() => MarketVendor)
  @JoinColumn()
  market_vendor: MarketVendor;

  @ManyToOne(() => District)
  @JoinColumn()
  district: District;

  @Column('varchar', { length: 50, nullable: true })
  priceLevel: string;

}
