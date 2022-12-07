import { Injectable } from '@ns3/di';
import { assertOk, toJson } from '@ns3/http-client';
import { Product } from 'react-demo/products/models/product';
import { AppFetchClient } from '../../shared/app-fetch-client';
import { ProductsQuery } from '../models/products-query';

@Injectable()
export class ProductsService {
  private url = '/api/products';

  constructor(private httpClient: AppFetchClient) {}

  get(id: string): Promise<Product> {
    return this.httpClient.get(`${this.url}/${id}`).then(toJson);
  }

  delete(id: string): Promise<void> {
    return this.httpClient.delete(`${this.url}/${id}`).then(assertOk);
  }

  create(value: Omit<Product, 'id'>): Promise<Product> {
    return this.httpClient.post(this.url, value).then(toJson);
  }

  patch(id: string, value: Partial<Product>): Promise<Product> {
    return this.httpClient.patch(`${this.url}/${id}`, value).then(toJson);
  }

  query(query: ProductsQuery): Promise<Product[]> {
    const url = `${this.url}?limit=${query.limit}&skip=${query.skip}`;

    return this.httpClient.get(url).then(toJson);
  }
}
