import { Box, Button, TextField } from '@material-ui/core';
import { FunctionComponent, useState } from 'react';
import { Product } from '../models/product';

type Props = {
  product: Product;
  onSubmit?: (product: Product) => void;
};

export const ProductForm: FunctionComponent<Props> = ({ product, onSubmit = () => null }) => {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);

  return (
    <Box my={4}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ ...product, name, price });
        }}
      >
        <TextField
          fullWidth
          style={{ margin: 8 }}
          onChange={(e) => setName(e.target.value)}
          id="name"
          label="Name"
          value={name}
          variant="filled"
        />
        <TextField
          fullWidth
          style={{ margin: 8 }}
          onChange={(e) => setPrice(+e.target.value)}
          type="number"
          id="price"
          label="Price"
          value={price}
          variant="filled"
        />
        <Button style={{ margin: 8 }} fullWidth type="submit">
          Submit
        </Button>
      </form>
    </Box>
  );
};
