import { useDependency } from '@ns3/react-di';
import { useStreamValue } from '@ns3/ts-utils';
import { FunctionComponent } from 'react';
import { combineLatest } from 'rxjs';
import { ProductsStore } from '../services/products.store';
import { ProductsFlagsCard } from './products-flags-card';

export const ProductsFlagsCont: FunctionComponent = () => {
  const productsStore = useDependency(ProductsStore);
  const [connectingKeys, deletingKeys, updatingKeys] = useStreamValue(
    () =>
      combineLatest([
        productsStore.fetching.keys(),
        productsStore.deleting.keys(),
        productsStore.updating.keys(),
      ]),
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
