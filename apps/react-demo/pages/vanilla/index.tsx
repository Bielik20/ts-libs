import { List } from '@material-ui/core';
import { useDependency } from '@ns3/react-di';
import { useStream } from '@ns3/ts-utils';
import { useProductsQuery } from 'react-demo/products/hooks/use-products-query';
import { ProductsShellComp } from 'react-demo/products/ui/products-shell.comp';
import { VanillaProductsService } from 'react-demo/recipes/vanilla/products/services/vanilla-products.service';
import { VanillaProductListItemCont } from 'react-demo/recipes/vanilla/products/ui/vanilla-product-list-item.cont';
import { vanillaRecipe } from 'react-demo/recipes/vanilla/vanilla-recipe';
import { ErrorComp } from 'react-demo/shared/error.comp';
import { LoaderComp } from 'react-demo/shared/loader.comp';

export default function Products() {
  const productsService = useDependency(VanillaProductsService);
  const query = useProductsQuery();
  const [status, products, error] = useStream(() => query && productsService.list(query), [query]);

  if (status === 'idle' || !query) {
    return null;
  }

  if (status === 'error') {
    return (
      <ProductsShellComp query={query} recipe={vanillaRecipe}>
        <ErrorComp error={error} />
      </ProductsShellComp>
    );
  }

  if (status === 'pending') {
    return (
      <ProductsShellComp query={query} recipe={vanillaRecipe}>
        <LoaderComp />
      </ProductsShellComp>
    );
  }

  return (
    <ProductsShellComp query={query} recipe={vanillaRecipe}>
      <List component="nav">
        {products.map((product) => (
          <VanillaProductListItemCont key={product.id} product={product} />
        ))}
      </List>
    </ProductsShellComp>
  );
}
