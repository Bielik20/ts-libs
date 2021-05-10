import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { ProductPagination } from 'react-demo/products/models/product-pagination';

export function useProductsQuery(): ProductPagination | false {
  const router = useRouter();

  return useMemo(() => {
    if (!router.isReady) {
      return false;
    }

    if (typeof router.query.limit === 'undefined' || typeof router.query.skip === 'undefined') {
      router.replace({
        pathname: router.pathname,
        query: { limit: 10, skip: 0 },
      });

      return false;
    }

    return {
      limit: +router.query.limit,
      skip: +router.query.skip,
    };
  }, [router.query, router.isReady]);
}
