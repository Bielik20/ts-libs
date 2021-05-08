import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { FunctionComponent, MouseEventHandler } from 'react';
import { Product } from 'react-demo/products/models/product';
import { ProductCardComp } from 'react-demo/products/ui/product-card.comp';
import { ProductFormComp } from 'react-demo/products/ui/product-form.comp';

type Props = {
  product: Product;
  updating?: boolean;
  deleting?: boolean;
  onEdit?: (product: Product) => void;
  onDelete?: MouseEventHandler;
};

export const ProductComp: FunctionComponent<Props> = ({
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
        <ProductCardComp product={product} onDelete={onDelete} />
        <ProductFormComp product={product} onSubmit={onEdit} />
      </Box>
    </Container>
  );
};
