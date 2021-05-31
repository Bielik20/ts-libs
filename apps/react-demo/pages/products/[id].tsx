import { useDependency } from '@ns3/react-di';
import { useStream } from '@ns3/react-utils';
import React from 'react';
import { useProductQuery } from 'react-demo/products/hooks/use-product-query';
import { ProductsStore } from 'react-demo/products/services/products.store';
import { ProductCont } from 'react-demo/products/ui/product.cont';
import { ErrorComp } from 'react-demo/shared/error.comp';
import { LoaderComp } from 'react-demo/shared/loader.comp';

export default function ProductDetails() {
  const productsStore = useDependency(ProductsStore);
  const { id } = useProductQuery();
  const [status, product, error] = useStream(() => productsStore.connect$(id), [id]);

  if (status === 'error') {
    return <ErrorComp error={error} />;
  }

  if (status === 'pending') {
    return <LoaderComp />;
  }

  return <ProductCont product={product} />;
}
