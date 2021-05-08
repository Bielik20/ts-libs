import { useDependency } from '@ns3/react-di';
import { useUnsubscribe } from '@ns3/ts-utils';
import { FunctionComponent, useState } from 'react';
import { Product } from 'react-demo/products/models/product';
import { ProductListItemComp } from 'react-demo/products/ui/product-list-item.comp';
import { SimpleProductsService } from 'react-demo/recipes/simple/products/services/simple-products.service';
import { takeUntil } from 'rxjs/operators';

type Props = {
  product: Product;
};

export const SimpleProductListItemCont: FunctionComponent<Props> = ({ product }) => {
  const unsubscribe$ = useUnsubscribe();
  const productsService = useDependency(SimpleProductsService);
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
