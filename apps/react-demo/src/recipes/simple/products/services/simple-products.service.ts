import { HttpClient, toResponse } from '@ns3/http-client';
import { omitUndefined } from '@ns3/ts-utils';
import { Injectable } from '@wikia/dependency-injection';
import { Product } from 'react-demo/products/models/product';
import { ProductPagination } from 'react-demo/products/models/product-pagination';
import { SimpleProductsListStore } from 'react-demo/recipes/simple/products/services/simple-products-list.store';
import { SimpleProductsStore } from 'react-demo/recipes/simple/products/services/simple-products.store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class SimpleProductsService {
  private url = '/api/products';

  constructor(
    private httpClient: HttpClient,
    private productsStore: SimpleProductsStore,
    private productsListStore: SimpleProductsListStore,
  ) {}

  get(id: string): Observable<Product> {
    return this.productsStore
      .connect(id, () => this.httpClient.get(`${this.url}/${id}`).pipe(toResponse()))
      .pipe(omitUndefined());
  }

  delete(id: string): Observable<void> {
    return this.httpClient.delete(`${this.url}/${id}`).pipe(
      toResponse<void>(),
      tap(() => this.productsStore.delete(id)),
      tap(() => this.productsListStore.invalidateAll()),
    );
  }

  create(value: Omit<Product, 'id'>): Observable<Product> {
    return this.httpClient.post(this.url, value).pipe(
      toResponse<Product>(),
      tap((product) => this.productsStore.set(product.id, product)),
    );
  }

  patch(id: string, value: Partial<Product>): Observable<Product> {
    return this.httpClient.patch(`${this.url}/${id}`, value).pipe(
      toResponse<Product>(),
      tap((product) => this.productsStore.set(product.id, product)),
    );
  }

  list(query: ProductPagination): Observable<ReadonlyArray<Product>> {
    const url = `${this.url}?limit=${query.limit}&skip=${query.skip}`;

    return this.productsListStore
      .connect(url, () => this.httpClient.get(url).pipe(toResponse<Product[]>()))
      .pipe(omitUndefined());
  }
}
