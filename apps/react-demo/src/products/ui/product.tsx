import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { FunctionComponent, MouseEventHandler } from 'react';
import { Product as ProductModel } from 'react-demo/products/models/product';
import { ProductCard } from './product-card';
import { ProductForm } from './product-form';

type Props = {
  product: ProductModel;
  updating?: boolean;
  deleting?: boolean;
  onEdit?: (product: ProductModel) => void;
  onDelete?: MouseEventHandler;
};

export const Product: FunctionComponent<Props> = ({
  product,
  updating,
  deleting,
  onDelete = () => null,
  onEdit = () => null,
}) => {
  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Product
        </Typography>
        {updating && (
          <Typography variant="body1" component="p" gutterBottom>
            Updating ...
          </Typography>
        )}
        {deleting && (
          <Typography variant="body1" component="p" gutterBottom>
            Deleting ...
          </Typography>
        )}
        <ProductCard product={product} onDelete={onDelete} />
        <ProductForm product={product} onSubmit={onEdit} />
      </Box>
    </Container>
  );
};
