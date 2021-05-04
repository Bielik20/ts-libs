import { NextApiRequest, NextApiResponse } from 'next';
import { productsRepository } from 'react-demo/products/repositories/products.repository';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return await getProducts(req, res);
    case 'POST':
      return await postProduct(req, res);
  }
}

async function getProducts(req: NextApiRequest, res: NextApiResponse) {
  const products = await productsRepository.list(req.query as any);

  return res.send(products);
}

async function postProduct(req: NextApiRequest, res: NextApiResponse) {
  const createProduct = await productsRepository.create(req.body);

  return res.send(createProduct);
}
