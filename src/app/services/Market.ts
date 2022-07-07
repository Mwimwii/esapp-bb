/* eslint-disable @typescript-eslint/camelcase */

import {
  District,
  MarketPrice, MarketVendor,
} from 'app/models';
// import { MarketPriceAPI, MarketVendorAPI } from 'app/types';

export class MarketService {
  async getAll() {
    const marketPrice = await MarketPrice.createQueryBuilder('market_price')
                                .orderBy('market_price.createdAt', 'ASC')
                                .getMany()
    return marketPrice
  }

  async add(data: any) {
    const {
      commodity: commodityId,
      market_vendor,
      district: districtId,
      price,
      priceLevel,
      unit
            } = data;


    const marketPrice = new MarketPrice();
    marketPrice.price = price
    marketPrice.priceLevel = priceLevel
    marketPrice.market_vendor = await this.getOrCreateMarketVendor(market_vendor, districtId)
    marketPrice.unit = unit
    marketPrice.commodity = commodityId
    await marketPrice.save();

    return marketPrice;
  }

  private async getOrCreateMarketVendor(market_vendor: any, district: District){
    if(market_vendor?.id){
      const marketVendor = await MarketVendor.getId(market_vendor.id)
      return marketVendor
    }

    const marketVendor = new MarketVendor()
    marketVendor.district = district
    marketVendor.contactNumber = market_vendor.contactNumber
    marketVendor.name = market_vendor.name
    await marketVendor.save()

    return marketVendor
  }

}

