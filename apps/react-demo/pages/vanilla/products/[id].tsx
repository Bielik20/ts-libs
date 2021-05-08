import { useDependency } from '@ns3/react-di';
import { useStream } from '@ns3/ts-utils';
import { useRouter } from 'next/router';
import React from 'react';
import { ProductComp } from 'react-demo/products/ui/product.comp';
import { VanillaProductsService } from 'react-demo/recipes/vanilla/products/services/vanilla-products.service';
import { ErrorComp } from 'react-demo/shared/error.comp';
import { LoaderComp } from 'react-demo/shared/loader.comp';

export default function ProductDetails() {
  const router = useRouter();
  const productsService = useDependency(VanillaProductsService);
  const [status, product, error] = useStream(() => productsService.get(router.query.id as string), [
    router.query.id,
  ]);

  if (status === 'error') {
    return <ErrorComp error={error} />;
  }

  if (status === 'pending') {
    return <LoaderComp />;
  }

  return <ProductComp product={product} />;
}
