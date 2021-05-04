import { Card, CardContent } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { useDependency } from '@ns3/react-di';
import { useStream } from '@ns3/ts-utils';
import { useRouter } from 'next/router';
import React from 'react';
import { ProductsService } from 'react-demo/recipes/vanilla/products/services/products.service';
import { ErrorComp } from 'react-demo/shared/error.comp';
import { LoaderComp } from 'react-demo/shared/loader.comp';

export default function ProductDetails() {
  const router = useRouter();
  const productsService = useDependency(ProductsService);
  const [status, product, error] = useStream(() => productsService.get(router.query.id as string), [
    router.query.id,
  ]);

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
}
