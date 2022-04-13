
import {
  MarketPrice,
} from 'app/models';
import { MarketPriceAPI } from 'app/types';

export class MarketService {
  async getAll() {
    const marketPrice = await MarketPrice.createQueryBuilder('market_price')
                                .orderBy('market_price.createdAt', 'ASC')
                                .getMany()
    return marketPrice
  }

  async add(
    data: MarketPriceAPI,
  ) {
    const {
      market,
      commodity_type,
      price_level,
      price,
      unit
            } = data;

    const marketPrice = new MarketPrice();
    marketPrice.market = market
    marketPrice.commodity_type = commodity_type
    marketPrice.price_level = price_level
    marketPrice.price = price
    marketPrice.unit = unit

    await marketPrice.save();

    return marketPrice;
  }

}

