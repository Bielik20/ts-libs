import { useDependency, useStreamValue, useUnsubscribe } from '@ns3/react-utils';
import { useRouter } from 'next/router';
import React, { FunctionComponent } from 'react';
import { combineLatest, takeUntil } from 'rxjs';
import { Product as ProductModel } from '../models/product';
import { ProductsStore } from '../services/products.store';
import { Product as ProductComponent } from './product';

type Props = {
  product: ProductModel;
};

export const ProductCont: FunctionComponent<Props> = ({ product }) => {
  const productsStore = useDependency(ProductsStore);
  const router = useRouter();
  const unsubscribe$ = useUnsubscribe([]);
  const [deleting, updating] = useStreamValue(
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
  const onEdit = (newProduct: ProductModel) => {
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
