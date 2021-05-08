import { List, ListItem, ListItemText } from '@material-ui/core';
import { useRouter } from 'next/router';
import { FunctionComponent } from 'react';
import { Link } from 'react-demo/layout/link';
import { Product } from 'react-demo/products/models/product';

type Props = {
  products: Product[];
};

export const ProductsComp: FunctionComponent<Props> = ({ products }) => {
  const router = useRouter();

  return (
    <List component="nav">
      {products.map((product) => (
        <ListItem
          button
          key={product.id}
          component={Link}
          href={`${router.pathname}/${product.id}`}
        >
          <ListItemText primary={product.name} secondary={product.price} />
        </ListItem>
      ))}
    </List>
  );
};
