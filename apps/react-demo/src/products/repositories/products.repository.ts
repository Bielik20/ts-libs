import faker from 'faker';
import { generateProducts } from 'react-demo/products/debug/generate-products';
import { Product } from 'react-demo/products/models/product';
import { ProductPagination } from 'react-demo/products/models/product-pagination';

export class ProductsRepository {
  private data = generateProducts();

  async get(id: string): Promise<Product> {
    return this.data.find((x) => x.id === id);
  }

  async delete(id: string): Promise<void> {
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
    const current = this.data.find((x) => x.id === id);
    const toUpdate = {
      ...current,
      ...value,
      id,
    };

    this.data = this.data.filter((x) => x.id !== id);
    this.data = [...this.data, toUpdate];

    return toUpdate;
  }

  async list(query: ProductPagination): Promise<Product[]> {
    return this.data.slice(+query.skip, +query.skip + +query.limit);
  }
}

export const productsRepository = new ProductsRepository();
