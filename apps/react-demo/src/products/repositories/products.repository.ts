import { faker } from '@faker-js/faker';
import { generateProducts } from '../debug/generate-products';
import { Product } from '../models/product';
import { ProductsQuery } from '../models/products-query';

export class ProductsRepository {
  private data = generateProducts();

  async get(id: string): Promise<Product> {
    const product = this.data.find((x) => x.id === id);

    if (product.shouldFail) {
      throw new Error('Should Fail');
    }

    return product;
  }

  async delete(id: string): Promise<void> {
    await this.get(id);
    this.data = this.data.filter((x) => x.id !== id);
  }

  async create(value: Omit<Product, 'id'>): Promise<Product> {
    const id = faker.datatype.uuid();
    const toInsert = {
      ...value,
      id,
    };

    this.data = [...this.data, toInsert];

    return toInsert;
  }

  async patch(id: string, value: Partial<Product>): Promise<Product> {
    const current = await this.get(id);
    const toUpdate = {
      ...current,
      ...value,
      id,
    };

    this.data = this.data.filter((x) => x.id !== id);
    this.data = [...this.data, toUpdate];

    return toUpdate;
  }

  async list(query: ProductsQuery): Promise<Product[]> {
    return this.data.slice(+query.skip, +query.skip + +query.limit);
  }
}

export const productsRepository = new ProductsRepository();
