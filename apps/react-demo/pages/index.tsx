import { Button, Card, CardActions, CardContent, Grid } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { Link } from 'react-demo/layout/link';
import { recipes } from 'react-demo/recipes/recipes';

export default function Index() {
  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h1" component="h1">
          Reactive Store
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom>
          Recipes of different complexity how to use Reactive Store utilities.
        </Typography>
      </Box>
      <Grid container spacing={5}>
        {recipes.map((recipe) => (
          <Grid item key={recipe.title} sm={6} xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  {recipe.title}
                </Typography>
                <Typography variant="body2" component="p">
                  {recipe.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button component={Link} href={recipe.url} size="small">
                  Learn More
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}