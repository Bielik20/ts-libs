import { RxConnectedMapStore } from '@ns3/rx-store';
import { Injectable } from '@wikia/dependency-injection';
import { SimpleProductsStore } from 'react-demo/recipes/simple/products/services/simple-products.store';

@Injectable()
export class SimpleProductsListStore extends RxConnectedMapStore<string, SimpleProductsStore> {
  constructor(productsStore: SimpleProductsStore) {
    super({ parent: productsStore, keyMapper: (value) => value.id });
  }
}
