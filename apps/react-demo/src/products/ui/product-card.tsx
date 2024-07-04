import { Button, Card, CardActions, CardContent, CardHeader } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { FunctionComponent, MouseEventHandler } from 'react';
import { Product } from '../models/product';
import { ProductAvatar } from './product-avatar';

type Props = {
  product: Product;
  onDelete?: MouseEventHandler;
};

export const ProductCard: FunctionComponent<Props> = ({ product, onDelete = () => null }) => {
  return (
    <Card>
      <CardHeader
        avatar={<ProductAvatar product={product} />}
        title={<Typography variant="h5">{product.name}</Typography>}
        subheader={product.id}
      />
      <CardContent>
        <Typography variant="body1" component="p">
          Price: {product.price}
        </Typography>
      </CardContent>
      <CardActions>
        <Button type="button" onClick={onDelete} size="small">
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};
