import { useDependency } from '@ns3/react-di';
import { useStream } from '@ns3/ts-utils';
import { useRouter } from 'next/router';
import React from 'react';
import { ProductComp } from 'react-demo/products/ui/product.comp';
import { SimpleProductsService } from 'react-demo/recipes/simple/products/services/simple-products.service';
import { ErrorComp } from 'react-demo/shared/error.comp';
import { LoaderComp } from 'react-demo/shared/loader.comp';
import { EMPTY } from 'rxjs';

export default function ProductDetails() {
  const router = useRouter();
  const productsService = useDependency(SimpleProductsService);
  const [status, product, error] = useStream(
    () => (router.query.id ? productsService.get(router.query.id as string) : EMPTY),
    [router.query.id],
  );

  if (status === 'error') {
    return <ErrorComp error={error} />;
  }

  if (status === 'pending') {
    return <LoaderComp />;
  }

  return <ProductComp product={product} />;
}
