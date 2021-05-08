import { Button, Card, CardActions, CardContent } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { FunctionComponent, MouseEventHandler } from 'react';
import { Product } from 'react-demo/products/models/product';

type Props = {
  product: Product;
  onDelete?: MouseEventHandler;
};

export const ProductCardComp: FunctionComponent<Props> = ({ product, onDelete = () => null }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          {product.name}
        </Typography>
        <Typography variant="body2" component="p" gutterBottom>
          Id: {product.id}
        </Typography>
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
