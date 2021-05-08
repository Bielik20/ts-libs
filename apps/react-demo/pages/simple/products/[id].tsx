import { useDependency } from '@ns3/react-di';
import { useStream, useUnsubscribe } from '@ns3/ts-utils';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Product } from 'react-demo/products/models/product';
import { ProductComp } from 'react-demo/products/ui/product.comp';
import { SimpleProductsService } from 'react-demo/recipes/simple/products/services/simple-products.service';
import { ErrorComp } from 'react-demo/shared/error.comp';
import { LoaderComp } from 'react-demo/shared/loader.comp';
import { EMPTY } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export default function ProductDetails() {
  const router = useRouter();
  const unsubscribe$ = useUnsubscribe([]);
  const productsService = useDependency(SimpleProductsService);
  const [status, product, error] = useStream(
    () => (router.query.id ? productsService.get(router.query.id as string) : EMPTY),
    [router.query.id],
  );
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const onDelete = () => {
    setDeleting(true);
    productsService
      .delete(product.id)
      .pipe(takeUntil(unsubscribe$))
      .subscribe(() => {
        setDeleting(false);
        router.push('.');
      });
  };
  const onEdit = (newProduct: Product) => {
    setUpdating(true);
    productsService
      .patch(newProduct.id, newProduct)
      .pipe(takeUntil(unsubscribe$))
      .subscribe(() => setUpdating(false));
  };

  if (status === 'idle') {
    return null;
  }

  if (status === 'error') {
    return <ErrorComp error={error} />;
  }

  if (status === 'pending') {
    return <LoaderComp />;
  }

  return (
    <ProductComp
      product={product}
      deleting={deleting}
      updating={updating}
      onDelete={onDelete}
      onEdit={onEdit}
    />
  );
}
