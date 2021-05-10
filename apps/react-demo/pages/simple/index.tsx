import { List } from '@material-ui/core';
import { useDependency } from '@ns3/react-di';
import { useStream } from '@ns3/ts-utils';
import { useProductsQuery } from 'react-demo/products/hooks/use-products-query';
import { ProductsShellComp } from 'react-demo/products/ui/products-shell.comp';
import { SimpleProductsService } from 'react-demo/recipes/simple/products/services/simple-products.service';
import { SimpleProductListItemCont } from 'react-demo/recipes/simple/products/ui/simple-product-list-item.cont';
import { simpleRecipe } from 'react-demo/recipes/simple/simple-recipe';
import { ErrorComp } from 'react-demo/shared/error.comp';
import { LoaderComp } from 'react-demo/shared/loader.comp';

export default function Products() {
  const productsService = useDependency(SimpleProductsService);
  const query = useProductsQuery();
  const [status, products, error] = useStream(() => query && productsService.list(query), [query]);

  if (status === 'idle' || !query) {
    return null;
  }

  if (status === 'error') {
    return (
      <ProductsShellComp query={query} recipe={simpleRecipe}>
        <ErrorComp error={error} />
      </ProductsShellComp>
    );
  }

  if (status === 'pending') {
    return (
      <ProductsShellComp query={query} recipe={simpleRecipe}>
        <LoaderComp />
      </ProductsShellComp>
    );
  }

  return (
    <ProductsShellComp query={query} recipe={simpleRecipe}>
      <List component="nav">
        {products.map((product) => (
          <SimpleProductListItemCont key={product.id} product={product} />
        ))}
      </List>
    </ProductsShellComp>
  );
}
