import { useDependency } from '@ns3/react-di';
import { useStream, useStreamValue, useUnsubscribe } from '@ns3/ts-utils';
import { useRouter } from 'next/router';
import React from 'react';
import { useProductQuery } from 'react-demo/products/hooks/use-product-query';
import { Product } from 'react-demo/products/models/product';
import { ProductsStore } from 'react-demo/products/services/products.store';
import { ProductsDeletingSet } from 'react-demo/products/services/products-deleting.set';
import { ProductsUpdatingSet } from 'react-demo/products/services/products-updating.set';
import { ProductComp } from 'react-demo/products/ui/product.comp';
import { ErrorComp } from 'react-demo/shared/error.comp';
import { LoaderComp } from 'react-demo/shared/loader.comp';
import { takeUntil } from 'rxjs/operators';

export default function ProductDetails() {
  const productsStore = useDependency(ProductsStore);
  const productsDeleting = useDependency(ProductsDeletingSet);
  const productsUpdating = useDependency(ProductsUpdatingSet);
  const router = useRouter();
  const unsubscribe$ = useUnsubscribe([]);
  const productId = useProductQuery();
  const [status, product, error] = useStream(() => productId && productsStore.connect(productId), [
    productId,
  ]);
  const deleting = useStreamValue(() => productId && productsDeleting.has(productId), [productId]);
  const updating = useStreamValue(() => productId && productsUpdating.has(productId), [productId]);
  const onDelete = () => {
    productsStore
      .delete(product.id)
      .pipe(takeUntil(unsubscribe$))
      .subscribe(() => router.push('.'));
  };
  const onEdit = (newProduct: Product) => {
    productsStore.patch(newProduct.id, newProduct).subscribe();
  };

  if (!productId) {
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
