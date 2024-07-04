import {
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core';
import { Delete, DeleteForever } from '@material-ui/icons';
import { useRouter } from 'next/router';
import { FunctionComponent, MouseEventHandler } from 'react';
import { Link } from '../../layout/link';
import { Product } from '../models/product';
import { ProductAvatar } from './product-avatar';

type Props = {
  product: Product;
  onDelete?: MouseEventHandler;
  onDeleteOptimistic?: MouseEventHandler;
  deleting?: boolean;
};

export const ProductListItem: FunctionComponent<Props> = ({
  product,
  onDelete = () => null,
  onDeleteOptimistic = () => null,
  deleting,
}) => {
  const router = useRouter();

  return (
    <ListItem button key={product.id} component={Link} href={`${router.pathname}/${product.id}`}>
      <ListItemAvatar>
        <ProductAvatar product={product} />
      </ListItemAvatar>
      <ListItemText primary={product.name} secondary={product.price} />
      {deleting && <ListItemText secondary={'Deleting...'} />}
      <ListItemSecondaryAction>
        <IconButton onClick={onDelete} edge="end" aria-label="delete">
          <Delete />
        </IconButton>
        <IconButton onClick={onDeleteOptimistic} edge="end" aria-label="delete-optimistic">
          <DeleteForever />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};
