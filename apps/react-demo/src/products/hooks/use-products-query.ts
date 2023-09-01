import { useDependency } from '@ns3/react-utils';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { ProductsQuery } from '../models/products-query';
import { ProductsStore } from '../services/products.store';

export function useProductsQuery(): ProductsQuery {
  const store = useDependency(ProductsStore);
  const router = useRouter();

  return useMemo(() => {
    if (
      typeof router.query['limit'] === 'undefined' ||
      typeof router.query['skip'] === 'undefined'
    ) {
      router.replace({
        pathname: router.pathname,
        query: store.query$.value as any, // There is a problem with NextJS typing
      });

      return store.query$.value;
    }

    return {
      limit: +router.query['limit'],
      skip: +router.query['skip'],
    };
  }, [router.query, router.isReady]);
}
