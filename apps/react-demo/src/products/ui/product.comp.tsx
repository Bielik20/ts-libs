import { Card, CardContent } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { FunctionComponent } from 'react';
import { Product } from 'react-demo/products/models/product';

type Props = {
  product: Product;
};

export const ProductComp: FunctionComponent<Props> = ({ product }) => {
  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Product ${product.id}
        </Typography>
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2">
              {product.name}
            </Typography>
            <Typography variant="body2" component="p">
              {product.price}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};
