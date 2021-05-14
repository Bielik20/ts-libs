import { useDependency } from '@ns3/react-di';
import { useUnsubscribe } from '@ns3/ts-utils';
import { FunctionComponent, useState } from 'react';
import { Product } from 'react-demo/products/models/product';
import { ProductsService } from 'react-demo/products/services/products.service';
import { ProductListItemComp } from 'react-demo/products/ui/product-list-item.comp';
import { takeUntil } from 'rxjs/operators';

type Props = {
  product: Product;
};

export const ProductListItemCont: FunctionComponent<Props> = ({ product }) => {
  const unsubscribe$ = useUnsubscribe([]);
  const productsService = useDependency(ProductsService);
  const [deleting, setDeleting] = useState(false);
  const onDelete = () => {
    setDeleting(true);
    productsService
      .delete(product.id)
      .pipe(takeUntil(unsubscribe$))
      .subscribe(() => {
        setDeleting(false);
      });
  };

  return <ProductListItemComp product={product} onDelete={onDelete} deleting={deleting} />;
};
