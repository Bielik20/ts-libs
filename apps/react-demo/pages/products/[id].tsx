import { useDependency } from '@ns3/react-di';
import { useStream, useStreamValue, useUnsubscribe } from '@ns3/ts-utils';
import { useRouter } from 'next/router';
import React from 'react';
import { useProductQuery } from 'react-demo/products/hooks/use-product-query';
import { Product } from 'react-demo/products/models/product';
import { ProductsStore } from 'react-demo/products/services/products.store';
import { Product as ProductComponent } from 'react-demo/products/ui/product';
import { ErrorComp } from 'react-demo/shared/error.comp';
import { LoaderComp } from 'react-demo/shared/loader.comp';
import { combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export default function ProductDetails() {
  const productsStore = useDependency(ProductsStore);
  const router = useRouter();
  const unsubscribe$ = useUnsubscribe([]);
  const { id } = useProductQuery();
  const [status, product, error] = useStream(() => productsStore.connect(id), [id]);
  const [deleting, updating] = useStreamValue(
    () => combineLatest([productsStore.deleting.has(id), productsStore.updating.has(id)]),
    [id],
  );
  const onDelete = () => {
    productsStore
      .delete(product.id)
      .pipe(takeUntil(unsubscribe$))
      .subscribe(() => router.push('.'));
  };
  const onEdit = (newProduct: Product) => {
    productsStore.patch(newProduct.id, newProduct).subscribe();
  };

  if (status === 'error') {
    return <ErrorComp error={error} />;
  }

  if (status === 'pending') {
    return <LoaderComp />;
  }

  return (
    <ProductComponent
      product={product}
      deleting={deleting}
      updating={updating}
      onDelete={onDelete}
      onEdit={onEdit}
    />
  );
}
