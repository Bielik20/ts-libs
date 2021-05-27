import { useDependency } from '@ns3/react-di';
import { useStreamValue, useUnsubscribe } from '@ns3/ts-utils';
import { useRouter } from 'next/router';
import React, { FunctionComponent } from 'react';
import { Product, Product as ProductModel } from 'react-demo/products/models/product';
import { ProductsStore } from 'react-demo/products/services/products.store';
import { Product as ProductComponent } from 'react-demo/products/ui/product';
import { combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

type Props = {
  product: ProductModel;
};

export const ProductCont: FunctionComponent<Props> = ({ product }) => {
  const productsStore = useDependency(ProductsStore);
  const router = useRouter();
  const unsubscribe$ = useUnsubscribe([]);
  const [deleting, updating] = useStreamValue(
    () =>
      combineLatest([
        productsStore.deleting.has$(product.id),
        productsStore.updating.has$(product.id),
      ]),
    [product.id],
  );
  const onDelete = () => {
    productsStore
      .delete(product.id)
      .pipe(takeUntil(unsubscribe$))
      .subscribe(() => router.push('.'));
  };
  const onEdit = (newProduct: Product) => {
    productsStore
      .patch(newProduct.id, newProduct)
      .subscribe({ error: (error) => alert(error.message) });
  };

  return (
    <ProductComponent
      product={product}
      deleting={deleting}
      updating={updating}
      onDelete={onDelete}
      onEdit={onEdit}
    />
  );
};
