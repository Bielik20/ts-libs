import { List, ListItem, ListItemText } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { useDependency } from '@ns3/react-di';
import { useStream } from '@ns3/ts-utils';
import { useRouter } from 'next/router';
import React from 'react';
import { Link } from 'react-demo/layout/link';
import { ProductsService } from 'react-demo/recipes/vanilla/products/services/products.service';
import { ErrorComp } from 'react-demo/shared/error.comp';
import { LoaderComp } from 'react-demo/shared/loader.comp';

export default function Products() {
  const router = useRouter();
  const productsService = useDependency(ProductsService);
  const [status, products, error] = useStream(productsService.list({ limit: 10, skip: 0 }), []);

  if (status === 'error') {
    return <ErrorComp error={error} />;
  }

  if (status === 'pending') {
    return <LoaderComp />;
  }

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Products
        </Typography>
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
      </Box>
    </Container>
  );
}
