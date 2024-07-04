import { useDependency, useStream } from '@ns3/react-utils';
import React from 'react';
import { useProductQuery } from '../../src/products/hooks/use-product-query';
import { ProductsStore } from '../../src/products/services/products.store';
import { ProductCont } from '../../src/products/ui/product.cont';
import { ErrorComp } from '../../src/shared/error.comp';
import { LoaderComp } from '../../src/shared/loader.comp';

export default function ProductDetails() {
  const productsStore = useDependency(ProductsStore);
  const { id } = useProductQuery();
  const product = useStream(() => productsStore.connect$(id), [id]);

  if (product.status === 'error') {
    return <ErrorComp error={product.error} />;
  }

  if (product.status === 'pending') {
    return <LoaderComp />;
  }

  return <ProductCont product={product.value} />;
}
