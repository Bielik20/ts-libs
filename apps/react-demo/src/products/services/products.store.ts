import { RxConnectArrays, RxConnectMap, RxSet } from '@ns3/rx-store';
import { omitUndefined } from '@ns3/ts-utils';
import { Injectable } from '@wikia/dependency-injection';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Product } from '../models/product';
import { ProductsQuery } from '../models/products-query';
import { ProductsService } from './products.service';

@Injectable()
export class ProductsStore {
  public readonly query$ = new BehaviorSubject<ProductsQuery>({ skip: 0, limit: 10 });
  public readonly deleting = new RxSet<string>();
  public readonly updating = new RxSet<string>();
  public readonly fetching = new RxSet<string>();
  public readonly entities = new RxConnectMap<string, Product>({
    connectingSet: this.fetching,
    timeout: 5 * 60 * 1000, // 5 minutes
    scope: 'single',
    strategy: 'lazy',
  });
  public readonly queried = new RxConnectArrays({
    itemsMap: this.entities,
    keyMapper: (value) => value.id,
    connectingSet: this.fetching,
    timeout: 5 * 60 * 1000, // 5 minutes
    scope: 'all',
    strategy: 'eager',
  });

  constructor(private readonly service: ProductsService) {}

  connect$(id: string): Observable<Product> {
    return this.entities.connect$(id, () => this.service.get(id)).pipe(omitUndefined());
  }

  connectQuery$(query: ProductsQuery): Observable<ReadonlyArray<Product>> {
    const key = `${query.limit}|${query.skip}`;
    this.query$.next(query);

    return this.queried.connect$(key, () => this.service.query(query)).pipe(omitUndefined());
  }

  delete(id: string): Observable<void> {
    this.deleting.add(id);

    return this.service.delete(id).pipe(
      tap({
        next: () => {
          this.entities.delete(id);
          this.deleting.delete(id);
          this.queried.invalidateAll();
        },
        error: () => {
          this.deleting.delete(id);
        },
      }),
    );
  }

  deleteOptimistic(id: string): Observable<void> {
    const oldValue = this.entities.get(id);

    this.deleting.add(id);
    this.entities.delete(id);

    return this.service.delete(id).pipe(
      tap({
        next: () => {
          this.deleting.delete(id);
          this.queried.invalidateAll();
        },
        error: () => {
          this.deleting.delete(id);
          this.entities.set(id, oldValue);
        },
      }),
    );
  }

  create(value: Omit<Product, 'id'>): Observable<Product> {
    return this.service
      .create(value)
      .pipe(tap((product) => this.entities.set(product.id, product)));
  }

  patch(id: string, value: Partial<Product>): Observable<Product> {
    this.updating.add(id);

    return this.service.patch(id, value).pipe(
      tap((product) => {
        this.entities.set(product.id, product);
        this.updating.delete(id);
      }),
    );
  }
}
