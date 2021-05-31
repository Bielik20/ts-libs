import { useDependency } from '@ns3/react-di';
import { useCombineLatestValue } from '@ns3/react-utils';
import { FunctionComponent } from 'react';
import { ProductsStore } from '../services/products.store';
import { ProductsFlagsCard } from './products-flags-card';

export const ProductsFlagsCont: FunctionComponent = () => {
  const productsStore = useDependency(ProductsStore);
  const [connectingKeys, deletingKeys, updatingKeys] = useCombineLatestValue(
    [
      productsStore.fetching.keys$(),
      productsStore.deleting.keys$(),
      productsStore.updating.keys$(),
    ],
    [],
  );

  return (
    <>
      <ProductsFlagsCard title="Connecting" flags={connectingKeys} />
      <ProductsFlagsCard title="Deleting" flags={deletingKeys} />
      <ProductsFlagsCard title="Updating" flags={updatingKeys} />
    </>
  );
};
