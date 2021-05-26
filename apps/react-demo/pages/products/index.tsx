import { List } from '@material-ui/core';
import { useDependency } from '@ns3/react-di';
import { useStream } from '@ns3/ts-utils';
import { useProductsQuery } from 'react-demo/products/hooks/use-products-query';
import { ProductsStore } from 'react-demo/products/services/products.store';
import { ProductListItemCont } from 'react-demo/products/ui/product-list-item.cont';
import { ProductsShellComp } from 'react-demo/products/ui/products-shell.comp';
import { ErrorComp } from 'react-demo/shared/error.comp';
import { LoaderComp } from 'react-demo/shared/loader.comp';

export default function Products() {
  const store = useDependency(ProductsStore);
  const query = useProductsQuery();
  const [status, products, error] = useStream(() => query && store.connectQuery(query), [query]);

  if (!query) {
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
          <ProductListItemCont key={product.id} product={product} />
        ))}
      </List>
    </ProductsShellComp>
  );
}
