import { RxArrayStore } from '@ns3/rx-store';
import { Injectable } from '@wikia/dependency-injection';
import { ProductsStore } from 'react-demo/products/services/products.store';

@Injectable()
export class ProductsListStore extends RxArrayStore<string, ProductsStore> {
  constructor(productsStore: ProductsStore) {
    super({
      entityStore: productsStore,
      keyMapper: (value) => value.id,
      timeout: 5 * 60 * 1000, // 5 minutes
      scope: 'all',
      strategy: 'eager',
    });
  }
}
