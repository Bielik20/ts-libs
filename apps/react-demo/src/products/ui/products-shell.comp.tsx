import { Button, ButtonGroup } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { useRouter } from 'next/router';
import { FunctionComponent } from 'react';
import { Link } from 'react-demo/layout/link';
import { ProductPagination } from 'react-demo/products/models/product-pagination';

type Props = {
  query: ProductPagination;
};

export const ProductsShellComp: FunctionComponent<Props> = ({ query, children }) => {
  const router = useRouter();

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Products
        </Typography>
        {children}
        <div>
          <ButtonGroup color="primary" aria-label="outlined primary button group">
            <Button
              disabled={query.skip - query.limit < 0}
              component={Link}
              href={`${router.pathname}/?limit=${query.limit}&skip=${query.skip - query.limit}`}
            >
              Previous
            </Button>
            <Button
              component={Link}
              href={`${router.pathname}/?limit=${query.limit}&skip=${query.skip + query.limit}`}
            >
              Next
            </Button>
          </ButtonGroup>
        </div>
      </Box>
    </Container>
  );
};
