import { RxMapStore } from '@ns3/rx-store';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class SimpleProductsListStore extends RxMapStore<string, ReadonlyArray<string>> {}
