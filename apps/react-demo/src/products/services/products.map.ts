import { RxConnectMap } from '@ns3/rx-store';
import { Injectable } from '@wikia/dependency-injection';
import { Product } from 'react-demo/products/models/product';
import { ProductsConnectingSet } from './products-connecting.set';

@Injectable()
export class ProductsMap extends RxConnectMap<string, Product> {
  constructor(connectingSet: ProductsConnectingSet) {
    super({
      connectingSet,
      timeout: 5 * 60 * 1000, // 5 minutes
      scope: 'single',
      strategy: 'lazy',
    });
  }
}
