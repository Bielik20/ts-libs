import { HttpClient, toResponse } from '@ns3/http-client';
import { Injectable } from '@wikia/dependency-injection';
import { Product } from 'react-demo/products/models/product';
import { ProductPagination } from 'react-demo/products/models/product-pagination';
import { Observable } from 'rxjs';

@Injectable()
export class VanillaProductsService {
  private url = '/api/products';

  constructor(private httpClient: HttpClient) {}

  get(id: string): Observable<Product> {
    return this.httpClient.get(`${this.url}/${id}`).pipe(toResponse());
  }

  delete(id: string): Observable<void> {
    return this.httpClient.delete(`${this.url}/${id}`).pipe(toResponse());
  }

  create(value: Omit<Product, 'id'>): Observable<Product> {
    return this.httpClient.post(this.url, value).pipe(toResponse());
  }

  patch(id: string, value: Partial<Product>): Observable<Product> {
    return this.httpClient.patch(`${this.url}/${id}`, value).pipe(toResponse());
  }

  list(query: ProductPagination): Observable<Product[]> {
    const url = `${this.url}?limit=${query.limit}&skip=${query.skip}`;

    return this.httpClient.get(url).pipe(toResponse());
  }
}
