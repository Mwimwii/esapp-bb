/* eslint-disable arrow-parens */
import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
  Generated,
  OneToMany,
} from 'typeorm';

import { BaseTable } from './BaseTable';
import { MarketVendorAPI } from '../types';
import { User, District, Farmer } from '.';
import { MarketPrice } from './MarketPrice';


@Entity({ name: 'market_vendors' })
export class MarketVendor extends BaseTable implements MarketVendorAPI {

  @Column('varchar', { nullable: true })
  contactNumber: string;

  @Column('varchar', { length: 150, nullable: true})
  name: string;

  @ManyToOne(() => District)
  @JoinColumn()
  district: District;

  @OneToOne(() => User, { nullable: true })
  @JoinColumn()
  user: User

  @OneToOne(() => Farmer, { nullable: true })
  @JoinColumn()
  farmer: Farmer

  @OneToMany(()=> MarketPrice, (market_price) => market_price.market_vendor)
  @JoinColumn()
  market_prices: MarketPrice[];

  @Column('varchar', { nullable: true })
  @Generated('uuid')
  uuid: string;
}
