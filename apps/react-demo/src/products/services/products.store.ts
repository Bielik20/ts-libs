import { RxMapStore } from '@ns3/rx-store';
import { Injectable } from '@wikia/dependency-injection';
import { Product } from 'react-demo/products/models/product';

@Injectable()
export class ProductsStore extends RxMapStore<string, Product> {
  constructor() {
    super({
      timeout: 5 * 60 * 1000, // 5 minutes
      scope: 'single',
      strategy: 'lazy',
    });
  }
}
