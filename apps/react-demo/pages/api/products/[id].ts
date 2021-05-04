import { NextApiRequest, NextApiResponse } from 'next';
import { productsRepository } from 'react-demo/products/repositories/products.repository';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return await getProduct(req, res);
    case 'PATCH':
      return await patchProduct(req, res);
  }
}

async function getProduct(req: NextApiRequest, res: NextApiResponse) {
  const getProduct = await productsRepository.get(req.query.id as string);

  return res.send(getProduct);
}

async function patchProduct(req: NextApiRequest, res: NextApiResponse) {
  const patchProduct = await productsRepository.patch(req.query.id as string, req.body);

  return res.send(patchProduct);
}
