import { useDependency } from '@ns3/react-di';
import { useStreamValue } from '@ns3/react-utils';
import { FunctionComponent } from 'react';
import { Product } from 'react-demo/products/models/product';
import { ProductsStore } from '../services/products.store';
import { ProductListItem } from './product-list-item';

type Props = {
  product: Product;
};

export const ProductListItemCont: FunctionComponent<Props> = ({ product }) => {
  const productsStore = useDependency(ProductsStore);
  const deleting = useStreamValue(productsStore.deleting.has$(product.id), [product.id]);
  const onDelete = () => {
    productsStore.delete(product.id).subscribe();
  };
  const onDeleteOptimistic = () => {
    productsStore.deleteOptimistic(product.id).subscribe();
  };

  return (
    <ProductListItem
      product={product}
      onDelete={onDelete}
      onDeleteOptimistic={onDeleteOptimistic}
      deleting={deleting}
    />
  );
};
