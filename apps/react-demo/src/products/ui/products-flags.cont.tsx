import { useDependency } from '@ns3/react-di';
import { useStreamValue } from '@ns3/ts-utils';
import { FunctionComponent } from 'react';
import { ProductsConnectingSet } from '../services/products-connecting.set';
import { ProductsDeletingSet } from '../services/products-deleting.set';
import { ProductsUpdatingSet } from '../services/products-updating.set';
import { ProductsFlagsCard } from './products-flags-card';

export const ProductsFlagsCont: FunctionComponent = () => {
  const connecting = useDependency(ProductsConnectingSet);
  const deleting = useDependency(ProductsDeletingSet);
  const updating = useDependency(ProductsUpdatingSet);
  const connectingKeys = useStreamValue(() => connecting.keys(), []);
  const deletingKeys = useStreamValue(() => deleting.keys(), []);
  const updatingKeys = useStreamValue(() => updating.keys(), []);

  return (
    <>
      <ProductsFlagsCard title="Connecting" flags={connectingKeys || []} />
      <ProductsFlagsCard title="Deleting" flags={deletingKeys} />
      <ProductsFlagsCard title="Updating" flags={updatingKeys} />
    </>
  );
};