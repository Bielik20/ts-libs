import { useRouter } from 'next/router';
import { ProductQuery } from '../models/product-query';

export function useProductQuery(): ProductQuery {
  const router = useRouter();

  return {
    id: router.query['id'] as string,
  };
}
