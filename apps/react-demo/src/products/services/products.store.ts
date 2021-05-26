import { omitUndefined } from '@ns3/ts-utils';
import { Injectable } from '@wikia/dependency-injection';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Product } from '../models/product';
import { ProductsQuery } from '../models/products-query';
import { ProductsArray } from './products.array';
import { ProductsMap } from './products.map';
import { ProductsService } from './products.service';
import { ProductsDeletingSet } from './products-deleting.set';
import { ProductsUpdatingSet } from './products-updating.set';

@Injectable()
export class ProductsStore {
  public readonly selectedQuery$ = new BehaviorSubject<ProductsQuery>({ skip: 0, limit: 10 });
  public readonly selectedId$ = new BehaviorSubject<string | undefined>(undefined);

  constructor(
    private readonly service: ProductsService,
    private readonly map: ProductsMap,
    private readonly array: ProductsArray,
    private readonly deleting: ProductsDeletingSet,
    private readonly updating: ProductsUpdatingSet,
  ) {}

  connect(id: string): Observable<Product> {
    this.selectedId$.next(id);

    return this.map.connect(id, () => this.service.get(id)).pipe(omitUndefined());
  }

  connectQuery(query: ProductsQuery): Observable<ReadonlyArray<Product>> {
    const key = `${query.limit}|${query.skip}`;
    this.selectedQuery$.next(query);

    return this.array.connect(key, () => this.service.query(query)).pipe(omitUndefined());
  }

  delete(id: string): Observable<void> {
    this.deleting.add(id);

    return this.service.delete(id).pipe(
      tap(() => {
        this.map.delete(id);
        this.deleting.delete(id);
        this.array.invalidateAll();
      }),
    );
  }

  create(value: Omit<Product, 'id'>): Observable<Product> {
    return this.service.create(value).pipe(tap((product) => this.map.set(product.id, product)));
  }

  patch(id: string, value: Partial<Product>): Observable<Product> {
    this.updating.add(id);

    return this.service.patch(id, value).pipe(
      tap((product) => {
        this.map.set(product.id, product);
        this.updating.delete(id);
      }),
    );
  }
}
