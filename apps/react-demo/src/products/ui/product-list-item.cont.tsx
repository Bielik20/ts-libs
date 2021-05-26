import { useDependency } from '@ns3/react-di';
import { useStreamValue } from '@ns3/ts-utils';
import { FunctionComponent } from 'react';
import { Product } from 'react-demo/products/models/product';
import { ProductListItemComp } from 'react-demo/products/ui/product-list-item.comp';
import { ProductsStore } from '../services/products.store';
import { ProductsDeletingSet } from '../services/products-deleting.set';

type Props = {
  product: Product;
};

export const ProductListItemCont: FunctionComponent<Props> = ({ product }) => {
  const productsStore = useDependency(ProductsStore);
  const productsDeleting = useDependency(ProductsDeletingSet);
  const deleting = useStreamValue(() => productsDeleting.has(product.id), [product.id]);
  const onDelete = () => {
    productsStore.delete(product.id).subscribe();
  };

  return <ProductListItemComp product={product} onDelete={onDelete} deleting={deleting} />;
};
