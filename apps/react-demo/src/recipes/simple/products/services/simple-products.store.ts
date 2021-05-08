import { RxMapStore } from '@ns3/rx-store';
import { Injectable } from '@wikia/dependency-injection';
import { Product } from 'react-demo/products/models/product';

@Injectable()
export class SimpleProductsStore extends RxMapStore<string, Product> {}
