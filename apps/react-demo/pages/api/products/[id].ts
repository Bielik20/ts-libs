import { NextApiRequest, NextApiResponse } from 'next';
import { productsRepository } from 'react-demo/products/repositories/products.repository';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return await getProduct(req, res);
    case 'DELETE':
      return await deleteProduct(req, res);
    case 'PATCH':
      return await patchProduct(req, res);
  }
}

async function getProduct(req: NextApiRequest, res: NextApiResponse) {
  const product = await productsRepository.get(req.query.id as string);

  if (!product) {
    res.status(404).send('Not Found');
  }
  return res.send(product);
}

async function deleteProduct(req: NextApiRequest, res: NextApiResponse) {
  await productsRepository.delete(req.query.id as string);

  return res.status(204).send(null);
}

async function patchProduct(req: NextApiRequest, res: NextApiResponse) {
  const patchProduct = await productsRepository.patch(req.query.id as string, req.body);

  return res.send(patchProduct);
}
