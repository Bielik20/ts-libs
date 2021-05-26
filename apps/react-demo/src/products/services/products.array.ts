import { RxConnectArrays } from '@ns3/rx-store';
import { Injectable } from '@wikia/dependency-injection';
import { ProductsMap } from './products.map';
import { ProductsConnectingSet } from './products-connecting.set';

@Injectable()
export class ProductsArray extends RxConnectArrays<string, ProductsMap> {
  constructor(itemsMap: ProductsMap, connectingSet: ProductsConnectingSet) {
    super({
      itemsMap,
      connectingSet,
      keyMapper: (value) => value.id,
      timeout: 5 * 60 * 1000, // 5 minutes
      scope: 'all',
      strategy: 'eager',
    });
  }
}
