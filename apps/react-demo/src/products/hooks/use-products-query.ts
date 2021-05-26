import { useDependency } from '@ns3/react-di';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { ProductsQuery } from '../models/products-query';
import { ProductsStore } from '../services/products.store';

export function useProductsQuery(): ProductsQuery | false {
  const store = useDependency(ProductsStore);
  const router = useRouter();

  return useMemo(() => {
    if (!router.isReady) {
      return false;
    }

    if (typeof router.query.limit === 'undefined' || typeof router.query.skip === 'undefined') {
      router.replace({
        pathname: router.pathname,
        query: store.selectedQuery$.value as any, // There is a problem with NextJS typing
      });

      return store.selectedQuery$.value;
    }

    return {
      limit: +router.query.limit,
      skip: +router.query.skip,
    };
  }, [router.query, router.isReady]);
}
