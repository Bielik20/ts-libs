import { IconButton, ListItem, ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { useRouter } from 'next/router';
import { FunctionComponent, MouseEventHandler } from 'react';
import { Link } from 'react-demo/layout/link';
import { Product } from 'react-demo/products/models/product';

type Props = {
  product: Product;
  onDelete?: MouseEventHandler;
  deleting?: boolean;
};

export const ProductListItem: FunctionComponent<Props> = ({
  product,
  onDelete = () => null,
  deleting,
}) => {
  const router = useRouter();

  return (
    <ListItem button key={product.id} component={Link} href={`${router.pathname}/${product.id}`}>
      <ListItemText primary={product.name} secondary={product.price} />
      {deleting && <ListItemText secondary={'Deleting...'} />}
      <ListItemSecondaryAction>
        <IconButton onClick={onDelete} edge="end" aria-label="delete">
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};
