import { Injectable } from '@ns3/di';
import { assertOk, toJson } from '@ns3/fetch-client';
import { AppFetchClient } from '../../shared/app-fetch-client';
import { Product } from '../models/product';
import { ProductsQuery } from '../models/products-query';

@Injectable()
export class ProductsService {
  private url = '/api/products';

  constructor(private fetchClient: AppFetchClient) {}

  get(id: string): Promise<Product> {
    return this.fetchClient.get(`${this.url}/${id}`).then(toJson<Product>());
  }

  delete(id: string): Promise<void> {
    return this.fetchClient.delete(`${this.url}/${id}`).then(assertOk);
  }

  create(value: Omit<Product, 'id'>): Promise<Product> {
    return this.fetchClient.post(this.url, value).then(toJson<Product>());
  }

  patch(id: string, value: Partial<Product>): Promise<Product> {
    return this.fetchClient.patch(`${this.url}/${id}`, value).then(toJson<Product>());
  }

  query(query: ProductsQuery): Promise<Product[]> {
    const url = `${this.url}?limit=${query.limit}&skip=${query.skip}`;

    return this.fetchClient.get(url).then(toJson<Product[]>());
  }
}
