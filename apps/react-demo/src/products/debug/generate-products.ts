import faker from 'faker';
import { Product } from 'react-demo/products/models/product';

export function generateProducts(): Product[] {
  faker.seed(100);

  return Array.from({ length: 100 }).map(() => generateProduct());
}

function generateProduct(): Product {
  return {
    id: faker.datatype.uuid(),
    name: faker.vehicle.vehicle(),
    price: +faker.finance.amount(10, 10000, 0),
  };
}
