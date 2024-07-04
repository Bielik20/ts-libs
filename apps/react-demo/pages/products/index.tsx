import { List } from '@material-ui/core';
import { useDependency, useStream } from '@ns3/react-utils';
import { useProductsQuery } from '../../src/products/hooks/use-products-query';
import { ProductsStore } from '../../src/products/services/products.store';
import { ProductListItemCont } from '../../src/products/ui/product-list-item.cont';
import { ProductsShell } from '../../src/products/ui/products-shell';
import { ErrorComp } from '../../src/shared/error.comp';
import { LoaderComp } from '../../src/shared/loader.comp';

export default function Products() {
  const store = useDependency(ProductsStore);
  const query = useProductsQuery();
  const products = useStream(() => store.connectQuery$(query), [query]);

  if (products.status === 'error') {
    return (
      <ProductsShell query={query}>
        <ErrorComp error={products.error} />
      </ProductsShell>
    );
  }

  if (products.status === 'pending') {
    return (
      <ProductsShell query={query}>
        <LoaderComp />
      </ProductsShell>
    );
  }

  return (
    <ProductsShell query={query}>
      <List component="nav">
        {products.value.map((product) => (
          <ProductListItemCont key={product.id} product={product} />
        ))}
      </List>
    </ProductsShell>
  );
}
