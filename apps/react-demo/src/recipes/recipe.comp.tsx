import { Button, Container } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import React, { FunctionComponent } from 'react';
import { Link } from 'react-demo/layout/link';
import { Recipe } from 'react-demo/recipes/recipe';

type Props = {
  recipe: Recipe;
};

export const RecipeComp: FunctionComponent<Props> = ({ recipe }) => {
  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h3" component="h1">
          {recipe.title}
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom>
          {recipe.description}
        </Typography>
        <Button component={Link} href={`${recipe.url}/products`} size="small">
          Products
        </Button>
      </Box>
    </Container>
  );
};
