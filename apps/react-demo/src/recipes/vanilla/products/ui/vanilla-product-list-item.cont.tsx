import { useDependency } from '@ns3/react-di';
import { useUnsubscribe } from '@ns3/ts-utils';
import { useRouter } from 'next/router';
import { FunctionComponent, useState } from 'react';
import { Product } from 'react-demo/products/models/product';
import { ProductListItemComp } from 'react-demo/products/ui/product-list-item.comp';
import { VanillaProductsService } from 'react-demo/recipes/vanilla/products/services/vanilla-products.service';
import { takeUntil } from 'rxjs/operators';

type Props = {
  product: Product;
};

export const VanillaProductListItemCont: FunctionComponent<Props> = ({ product }) => {
  const router = useRouter();
  const unsubscribe$ = useUnsubscribe([]);
  const productsService = useDependency(VanillaProductsService);
  const [deleting, setDeleting] = useState(false);
  const onDelete = () => {
    setDeleting(true);
    productsService
      .delete(product.id)
      .pipe(takeUntil(unsubscribe$))
      .subscribe(() => {
        setDeleting(false);
        router.reload();
      });
  };

  return <ProductListItemComp product={product} onDelete={onDelete} deleting={deleting} />;
};
