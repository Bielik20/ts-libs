import { List } from '@material-ui/core';
import { useDependency } from '@ns3/react-di';
import { useStream } from '@ns3/ts-utils';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { ProductPagination } from 'react-demo/products/models/product-pagination';
import { ProductsShellComp } from 'react-demo/products/ui/products-shell.comp';
import { SimpleProductsService } from 'react-demo/recipes/simple/products/services/simple-products.service';
import { SimpleProductListItemCont } from 'react-demo/recipes/simple/products/ui/simple-product-list-item.cont';
import { ErrorComp } from 'react-demo/shared/error.comp';
import { LoaderComp } from 'react-demo/shared/loader.comp';

export default function Products() {
  const router = useRouter();
  const query: ProductPagination = useMemo(
    () => ({
      limit: +router.query.limit || 10,
      skip: +router.query.skip || 0,
    }),
    [router.query],
  );
  const productsService = useDependency(SimpleProductsService);
  const [status, products, error] = useStream(() => productsService.list(query), [query]);

  if (status === 'idle') {
    return null;
  }

  if (status === 'error') {
    return (
      <ProductsShellComp query={query}>
        <ErrorComp error={error} />
      </ProductsShellComp>
    );
  }

  if (status === 'pending') {
    return (
      <ProductsShellComp query={query}>
        <LoaderComp />
      </ProductsShellComp>
    );
  }

  return (
    <ProductsShellComp query={query}>
      <List component="nav">
        {products.map((product) => (
          <SimpleProductListItemCont key={product.id} product={product} />
        ))}
      </List>
    </ProductsShellComp>
  );
}
